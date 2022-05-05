import store from '../../store'

export function setToken (){
    const config = {
            headers: { 
                'auth-token': localStorage.getItem('token'),
                Accept: 'application/json'
            }
        };
    return config;    
}

export function setclientToken (){
    const config = {
            headers: { 
                'auth-token': localStorage.getItem('clienttoken'),
                Accept: 'application/json'
            }
        };
    return config;    
}

// export const api_url = "http://localhost:3000/api";
export const api_url = "https://agrifamily.herokuapp.com/api";

export function readBufferImg(imagedata) {
    var bytes = new Uint8Array(imagedata.data);
    var binary = bytes.reduce(
      (data, b) => (data += String.fromCharCode(b)),
      ""
    );
    return binary;
  }

export function getShowLang(prop) {
    if (store.getters.getLocalLang.length > 0) {
        let propval = store.getters.getLocalLang.filter((x) => x.props == prop && x.type == 'const');
        return propval.length > 0 ? propval[0].text : "Not Set";
      }
  }

export function getAppShowLang(prop) {
    if (store.getters.getLocalLang.length > 0) {
        let propval = store.getters.getLocalLang.filter((x) => x.props == prop && x.type == 'app');
        return propval.length > 0 ? propval[0].text : "Not Set";
      }
  }
