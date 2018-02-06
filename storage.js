/**
 * @author Tiago Ribeiro - www.tiago-ribeiro.com
 * @description Helper class that has several utilitary functions such as field validation, isEmpty, isArray, etc
 * @see https://github.com/Ribeiro-Tiago/local-storage
 * @copyright MIT license, 2017
 * @version 1.0.0
 */

/**
 * Serves as a wrapper around local storage, whether on browser or mobile (react native / phonegap)
 */
(function(){
    'use strict'
    let isBrowser = (window);

    let storage = isBrowser ? localStorage : "";

    /**
     * Function to be used locally that checks if a value is empty
     * @param {*} value - value to be checked
     * @return {boolean} - return true if the value is empty and false otherwise
     */
    let isEmpty = (value) => {
        return (value === void 0 || value === "" || value === null || String(value).toLocaleLowerCase() === "null" || value === "undefined" || (typeof value === "object" && Object.keys(value).length === 0));
    };

    /**
     * Checks whether or not the received value is a string
     * @param {*} value - value to be checked
     * @return {boolean} - returns true if the value is array and false otherwise
     */
    let isString = (value) => {
        return typeof value === "string";
    };
    
    /**
     * Checks whether or not the received value is an array
     * @param {*} value - value to be checked
     * @return {boolean} - returns true if the value is array and false otherwise
     */
    let isArray = (value) => {
        return value.length;
    };

    /**
     * Gets all the local storage entry keys
     * @return {Array} - returns an array with all the keys
     */
    let keys = () => {
        return Object.keys(storage);
    };

    /**
     * Gets a local storage entry and returns it
     * @param {string} key - key for the entry we're looking for
     * @return {JSON} - returns the requuest entry in JSON format
     */
    let get = (key) => {
        if (isEmpty(key) || typeof key != "string")
            throw new Exception("Expected a string as param 1 on storage.get and " + typeof key + " was given");

        return storage.getItem(key);
    };

    /**
     * Creates new storage entry with or without values
     * @param {string} key - name of the new key
     * @param {Array / JSON} items - any values we wanna inesrt as we create the entry 
     */
    let create = (key, items = "") => {
        if (isEmpty(key) || !isString(key))
            throw new Exception("Expected a string as param 1 of storage.create and " + typeof key + " was given");

        if (!isEmpty(items) && (isArray(items) || isString(items)))
            throw new Exception("Expected a string (or JSON) or array as param 2 of storage.create and " + typeof items + " was given");

        storage.setItem(key, items);
    };

    /**
     * Removes a entry from storage
     * @param {string} key - key of the entry to be removed
     */
    let erase = (key) => {
        if (isEmpty(key) || !isString(key))
            throw new Exception("Expected a string as param 1 of storage.erase and " + typeof key + " was given");

        storage.removeItem(key);
    };

    /**
     * resets local storage
     */
    let reset = () => {
        stroage.clear();
    };

    /**
     * finds the client and updates that value
     * @param {object} newValue - new value for the collection
     */
    let update = (newValue, collection = "test_clients") => {
        let clients = localStorage.getItem(collection);
        clients = (util.isEmpty(clients)) ? clients : JSON.parse(clients);

        clients.map((c, i) => {
            if (c.id == newValue.id){
                if (collection == "test_clients" && util.isEmpty(newValue.password)){
                    newValue.password = clients[i].password;
                }

                clients[i] = newValue;
                return;
            }
        });

        localStorage.setItem(collection, JSON.stringify(clients));
    };

    /**
     * inserts new record on the client "collection"
     * @param {object} value - new value to insert on the collection
     */
    let insert = (value, collection = "test_clients") => {
        let tmp = localStorage.getItem(collection);
        tmp = (util.isEmpty(tmp)) ? tmp : JSON.parse(tmp);        
        
        localStorage.setItem(collection, JSON.stringify(Array(...tmp, {id: client_id, ...value, type: 2})));
        client_id++;
        localStorage.setItem("test_client_id", client_id);
        
        return (client_id - 1);
    };

    /**
     * removes x record from the collection
     * @param {int} id - id of the record we want to remove
     */
    let remove = (id, collection = "test_clients") => {
        let clients = localStorage.getItem(collection);
        clients = (util.isEmpty(clients)) ? clients : JSON.parse(clients);        
        
        clients.map((c, index) => {
            if (c.id == id){
                clients.splice(index, 1);
                return;
            }
        })

        localStorage.setItem(collection, JSON.stringify(clients));
    };

    let storage = {
        get,
        create,
        erase,
        reset,
        insert,
        update,
        remove
    };

    // browser 
    if (isBrowser) {
        window.storage = storage;
    }
    // react native
})(); 