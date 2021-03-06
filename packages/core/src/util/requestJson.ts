
export default function requestJson(method: string, url: string, params: object, successCallback, failureCallback) {
  method = method.toUpperCase()

  let body = null

  if (method === 'GET') {
    url = injectQueryStringParams(url, params)
  } else {
    body = encodeParams(params)
  }

  let xhr = new XMLHttpRequest()
  xhr.open(method, url, true)

  if (method !== 'GET') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  }

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      let parsed = false
      let res

      try {
        res = JSON.parse(xhr.responseText)
        parsed = true
      } catch (err) {}

      if (parsed) {
        successCallback(res, xhr)
      } else {
        failureCallback('Failure parsing JSON', xhr)
      }

    } else {
      failureCallback('Request failed', xhr)
    }
  }

  xhr.onerror = function() {
    failureCallback('Request failed', xhr)
  }

  xhr.send(body)
}

function injectQueryStringParams(url: string, params) {
  return url +
    (url.indexOf('?') === -1 ? '?' : '&') +
    encodeParams(params)
}

function encodeParams(params) {
  let parts = []

  for (let key in params) {
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
  }

  return parts.join('&')
}
