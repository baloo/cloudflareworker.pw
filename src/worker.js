
var module = {
    exports: {}
}

@@zxcvbn@@

var zxcvbn = module.exports;


addEventListener('fetch', event => {
  event.respondWith(checkPassword(event.request))
})

function fromUTF8Array(data) { // array of bytes
  var str = '',
      i;

  for (i = 0; i < data.length; i++) {
    var value = data[i];

    if (value < 0x80) {
      str += String.fromCharCode(value);
    } else if (value > 0xBF && value < 0xE0) {
      str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
      i += 1;
    } else if (value > 0xDF && value < 0xF0) {
      str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
      i += 2;
    } else {
      // surrogate pair
      var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

      str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00); 
      i += 3;
    }
  }

  return str;
}

async function readableStreamToString(readable) {
  const chunks = [];

  let result;
  while (!(result = await readable.read()).done) {
    Array.prototype.push.apply(chunks, Object.values(result.value));
  }

  // Assuming this is utf8, and shit that js does not have a standard library
  // for that :/
  return fromUTF8Array(chunks);
}

async function checkPassword(request) {
  const password = await readableStreamToString(request.body.getReader());

  const responseInit = {
    status: 200,
    headers: new Headers({'Content-Type': 'application/json'})
  }
  return new Response(JSON.stringify(zxcvbn(passwordbytes)), responseInit)
}

