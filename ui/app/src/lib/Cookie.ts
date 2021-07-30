export const getCookie = (name: string): string | null => {
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[ i ].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
  return null;
}

export const setCookie = (name: string, value: string): void => {
  if (document.cookie && document.cookie !== '') {
    document.cookie = `${ name }=${ value };path=/`
  }
}

export const deleteCookie = (name: string): void => {
  const cookie = getCookie(name)
  if (cookie !== null) {
    setCookie(name, `${ cookie };expires=Thu, 01 Jan 1970 00:00:01 GMT`)
  }
}