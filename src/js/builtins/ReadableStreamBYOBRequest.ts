/*
 * Copyright (C) 2017 Canon Inc.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export function initializeReadableStreamBYOBRequest(this, controller, view) {
  if (arguments.length !== 3 && arguments[2] !== $isReadableStream)
    throw new TypeError("ReadableStreamBYOBRequest constructor should not be called directly");

  return $privateInitializeReadableStreamBYOBRequest.$call(this, controller, view);
}

export function respond(this, bytesWritten) {
  if (!$isReadableStreamBYOBRequest(this)) throw $ERR_INVALID_THIS("ReadableStreamBYOBRequest");

  if ($getByIdDirectPrivate(this, "associatedReadableByteStreamController") == null)
    throw $ERR_INVALID_STATE_TypeError("This BYOB request has been invalidated");

  return $readableByteStreamControllerRespond(
    $getByIdDirectPrivate(this, "associatedReadableByteStreamController"),
    bytesWritten,
  );
}

export function respondWithNewView(this, view) {
  if (!$isReadableStreamBYOBRequest(this)) throw $ERR_INVALID_THIS("ReadableStreamBYOBRequest");

  if ($getByIdDirectPrivate(this, "associatedReadableByteStreamController") == null)
    throw $ERR_INVALID_STATE_TypeError("This BYOB request has been invalidated");

  if (!$isObject(view)) throw $ERR_INVALID_ARG_TYPE("view", "Buffer, TypedArray, or DataView", view);

  if (!ArrayBuffer.$isView(view)) throw $ERR_INVALID_ARG_TYPE("view", "Buffer, TypedArray, or DataView", view);

  return $readableByteStreamControllerRespondWithNewView(
    $getByIdDirectPrivate(this, "associatedReadableByteStreamController"),
    view,
  );
}

$getter;
export function view(this) {
  if (!$isReadableStreamBYOBRequest(this)) throw $ERR_INVALID_THIS("ReadableStreamBYOBRequest");

  return $getByIdDirectPrivate(this, "view");
}
