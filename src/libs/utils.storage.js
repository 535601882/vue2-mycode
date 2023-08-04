class Storage {
  constructor(namespace = "namesapce") {
    // 命名空间：防止污染全局
    this.namespace = namespace;
  }

  get(key, defaultVal = null) {
    // get the parsed value of the given key
    let result = JSON.parse(window.localStorage.getItem(this.getKeyForNamespace(key)));

    // if the key has value
    if (result) {
      // if the entry is expired
      // remove the entry and return null
      if (result.expireTime <= Date.now()) {
        window.localStorage.removeItem(this.getKeyForNamespace(key));
        return null;
      }

      // else return the value
      return result.data;
    }

    // if the key does not have value
    return defaultVal;
  }

  // add an entry
  // default expiry is 30 days in milliseconds
  set(key, value, maxAge = 30 * 60 * 60 * 1000) {
    // store the value as object
    // along with expiry date
    let result = {
      data: value,
    };
    if (maxAge === 0) return;
    if (maxAge) {
      // set the expiry
      // from the current date
      result.expireTime = Date.now() + maxAge;
    }

    // stringify the result
    // and the data in original storage
    window.localStorage.setItem(this.getKeyForNamespace(key), JSON.stringify(result));
  }

  // remove the entry with the given key
  remove(key) {
    window.localStorage.removeItem(this.getKeyForNamespace(key));
  }

  // clear the storage
  clear() {
    window.localStorage.clear();
  }

  getKeyForNamespace(key) {
    return `${this.namespace + "_" + key}`;
  }
}
let storage = new Storage();
export default storage;
