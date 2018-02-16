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
    /**
     * Tells us if we're running this plugin on browser or react native
     */
    let isBrowser = (typeof navigator != 'undefined' && navigator.product == 'ReactNative');
    
    /** 
     * Local storage object. It'll either be AsyncStorage from react native
     * or LocalStorage from regular browser 
    */
    let storage = null;

    /** TODO:
     *  descobrir como importar libs react só quando em react */    
    if (!isBrowser){
        /* import React from "react";
        import { AsyncStorage } from "react-native"; */
        
        //storage = AsyncStorage;
    }
    else {
        storage = window.storage;
    }
    
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
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    /**
     * Checks whether or not the received value is an object
     * @param {*} value - value to be checked
     * @return {boolean} - returns true if the value is object and false otherwise
     */
    let isObject = (value) => {
        return Object.prototype.toString.call(value) === '[object Object]';
    };
    
    /**
     * Checks whether or not the received value is a function
     * @param {*} value - value to be checked
     * @return {boolean} - returns true if the value is object and false otherwise
     */
    let isFunction = (value) => {
        return Object.toString.call(value) === '[object Function]';
    };

    /**
     * Tries to parse a previously stringified string. 
     * If string wasn't stringified, simply return it
     * @param {string} value - value to be parsed
     */
    let parse = (value) => {
        try {
            return JSON.parse(value);
        } 
        catch (Exception) {
            return value;
        };
    };

    
    /**
     * Gets all the local storage entry keys
     * @return {Promise} - returns a promise with every all the existing keys on localstorage 
     */
    let keys = () => {
        return isBrowser ? 
            new Promise((resolve, reject) => {
                resolve(localStorage)
            }) 
            : storage.getAllKeys();
    };

    /**
     * Gets a local storage entry and executes callbbackfunctions
     * @param {string} key - key for the entry we're looking for
     * @return {Promise} - returns a promise with every all the value of the received key
     */
    let get = (key) => {
        if (isEmpty(key) || typeof key != "string")
            throw new Error("Expected a string as param 1 on storage.get and " + typeof key + " was given");

        // if browser we get the item and return it
        return new Promise((resolve, reject) => {
            if (!isBrowser){
                try {
                    storage.getItem(key).then(result => { 
                        resolve(parse(result));
                    });
                }
                catch(ex) {
                    reject(ex.message);
                }
            }
            else {
                resolve(parse(storage.getItem(key)));
            }
        });
    };

    /**
     * Creates new storage entry with or without values
     * @param {string} key - name of the new key
     * @param {string / array / obj} items - any values we wanna inesrt as we create the entry 
     * In case of using react native, the callback will also return errors
     */
    let create = (key, items = "") => {
        if (isEmpty(key) || !isString(key))
            throw new Error("Expected a string as param 1 of storage.create and " + typeof key + " was given");
    
        /**
         * Checks whether or not items is a string. if it's not, 
         * we stringify to better save on localhost
         */
        if (!isString(items)){
            items = JSON.stringify(items);
        }

        return new Promise((resolve, reject) => {
            if (isBrowser){
                storage.setItem(key, items);
                resolve(true);
            }
            else {
                storage.setItem(key, items).then(res => resolve(res)).catch(err => reject(err));
            }
        });
    };

    /**
     * Removes a en 8try from storage
     * @param {string} key - key of the entry to be removed
     * @param {function} callback - callback function to be executed after item is removed.
     * In case of using react native, the callback will also return errors
     */
    let erase = (key, callback = (err) => {}) => {
        if (isEmpty(key) || !isString(key))
            throw new Error("Expected a string as param 1 of storage.erase and " + typeof key + " was given");

        if (isFunction(callback))
            throw new Error("Expected a function as param 2 on storage.get and " + typeof callback + " was given");

        if (isBrowser){
            storage.removeItem(key);
            callback();
        }
        else
            storage.removeItem(key, callback);
    };

    /**
     * @param {function} callback - callback function to be executed after item is removed.
     * In case of using react native, the callback will also return errors
     */
    let reset = (callback = (err) => {}) => {
        if (isBrowser){
            storage.clear();
            callback();
        }
        else
            storage.clear(callback);
    };

    /**
     * inserts new record on the client "key"
     * @param {object} value - new value to insert on the key
     */
    let insert = (key, value) => {
        /**
         * Validates type of new value and existing ones.
         * If the type is the same we "merge" them, otherwise a new Error is thrown
         * @param {string | object | array} item - new item to be added
         * @return {string | object | array} - returns the result of the new and existing values
         */
        var add = (item) => {
            if (isEmpty(item) || isEmpty(value)){
                return item;
            }
            
            if (isString(item) && isString(value)){
                return item += value;
            }
            
            if (isObject(item) && isObject(value)){
                return JSON.stringify({...item, ...value});
            }

            if (isArray(item)){
                if (isArray(value))
                    return JSON.stringify([...item, ...value]);

                if (typeof item[0] === typeof value){
                    return JSON.stringify([...item, ...[value]]);

                }
            }
            
            throw new Error("New value isn't same type existing values. Expected " + Object.prototype.toString.call(item) + " and got " + Object.prototype.toString.call(value));
        };

        return new Promise((resolve, reject) => {
            if (isBrowser) {
                storage.setItem(key, add(parse(storage.getItem(key))));
                resolve(true);
            }
            else {
                storage.setItem(
                    key, 
                    storage.getItem(key).then(res => add(parse(res)))
                )
                .then(res => resolve(res))
                .catch(err => reject(err));
            }
        });
    };

    /**
     * finds the client and updates that value
     * @param {string} key - string refering to the netry key 
     * @param {object} args - "hwere" condition so that we know what we're updating
     * @param {string / object} newValue - new value 
     */
    let update = (key, args, newValue) => {
        if (!isString(key))
            throw new Error("Expected a string as param 1 on storage.update and " + typeof key + " was given");

        if (!isObject(args))
            throw new Error("Expected a object as param 2 on storage.update and " + typeof args + " was given");


        if (!isString(params) && !isObject(params))
            throw new Error("Expected a string or object as param 3 on storage.update and " + typeof params + " was given");

        let clients = localStorage.getItem(key);
        clients = (util.isEmpty(clients)) ? clients : JSON.parse(clients);

        clients.map((c, i) => {
            if (c.id == newValue.id){
                if (key == "test_clients" && util.isEmpty(newValue.password)){
                    newValue.password = clients[i].password;
                }

                clients[i] = newValue;
                return;
            }
        });

        localStorage.setItem(key, JSON.stringify(clients));
    };

    /**key
     * removes x record from the collection
     * @param {int} id - id of the record we want to remove
     */
    let remove = (id, key) => {key
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

    /**
     * Looks for values with the given params within the entry with the given key
     * @param {string} key - entry we're looking for
     * @param {string / object} params - search params (the entry may be an object or just one string)
     * @return {object / string / null} - returns the result found or null if none was found
     */
    let find = (key, params) => {
        if (!isString(key))
            throw new Error("Expected a string as param 1 on storage.find and " + typeof key + " was given");

        if (!isString(params) && !isObject(params))
            throw new Error("Expected a string or object as param 2 on storage.find and " + typeof params + " was given");

        var lookup = (item, resolve, reject) => {
            try {
                item = JSON.parse(item);
            }
            catch (Exception){
                item = item;
            }

            if (isString(item)){
                resolve((item === params) ? item : "");
            }
            else if (isArray(item)){
                
            }
            else if (isObject(item)) {

            }
            else {
                reject("Key is invalid!");
            }
        };

        lookup(storage.getItem(key, {}, (err) => {}));
    };

    let tmp = {
        get,
        create,
        erase,
        reset,
        insert,
        update,
        remove,
        find
    };

    // browser 
    if (isBrowser) {
        window.storage = tmp;
    }
    // react native
})(); 