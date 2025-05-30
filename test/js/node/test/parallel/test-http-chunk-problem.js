'use strict';
// http://groups.google.com/group/nodejs/browse_thread/thread/f66cd3c960406919
const common = require('../common');
if (!common.hasCrypto)
  common.skip('missing crypto');

const assert = require('assert');

if (process.argv[2] === 'request') {
  const http = require('http');
  const options = {
    port: +process.argv[3],
    path: '/'
  };

  http.get(options, (res) => {
    res.pipe(process.stdout);
  });

  return;
}

if (process.argv[2] === 'shasum') {
  const crypto = require('crypto');
  const shasum = crypto.createHash('sha1');
  let total = 0;
  process.stdin.on('data', (d) => {
    console.warn("Chunk: " + d.length);
    total += d.length;
    shasum.update(d);
  });

  process.stdin.on('close', () => {
    console.warn("Total:", total);
    process.stdout.write(shasum.digest('hex'));
  });

  return;
}

const http = require('http');
const cp = require('child_process');

const tmpdir = require('../common/tmpdir');

const filename = tmpdir.resolve('big');
let server;

function executeRequest(cb) {
  // The execPath might contain chars that should be escaped in a shell context.
  // On non-Windows, we can pass the path via the env; `"` is not a valid char on
  // Windows, so we can simply pass the path.
  const node = `"${common.isWindows ? process.execPath : '$NODE'}"`;
  const file = `"${common.isWindows ? __filename : '$FILE'}"`;
  const env = common.isWindows ? process.env : { ...process.env, NODE: process.execPath, FILE: __filename };
  cp.exec([node,
           file,
           'request',
           server.address().port,
           '|',
           node,
           file,
           'shasum' ].join(' '),
          { env },
          (err, stdout, stderr) => {
            if (stderr.trim() !== '') {
              console.error(stderr);
            }
            console.log(stdout.toString());
            assert.ifError(err);
            assert.strictEqual(stdout.slice(0, 40),
                               '8c206a1a87599f532ce68675536f0b1546900d7a');
            cb();
          }
  );
}


tmpdir.refresh();

common.createZeroFilledFile(filename);

server = http.createServer(function(req, res) {
  res.writeHead(200);

  // Create the subprocess
  const cat = cp.spawn('cat', [filename]);

  // Stream the data through to the response as binary chunks
  cat.stdout.on('data', (data) => {
    res.write(data);
  });

  cat.stdout.on('end', () => res.end());

  // End the response on exit (and log errors)
  cat.on('exit', (code) => {
    if (code !== 0) {
      console.error(`subprocess exited with code ${code}`);
      process.exit(1);
    }
  });

});

server.listen(0, () => {
  executeRequest(() => server.close());
});
