# Work in Progress

Dependency-less library that acts as a wrapper around local storage for browser and mobile (react native, phonegap)

# Planned functions
- [keys](#keys)
- [get](#get)
- [create](#create)
- [erase](#erase)
- [reset](#reset)
- [insert](#insert)
- [update](#update)
- [remove](#remove)


## keys
```sh 
    storage.keys.then((result) => {
        // do what you will
    }).;
``` 

## get
```sh
    storage.get(key).then((result) => {
        // do what you will
    })
```

## create
```sh
    storage.create("objct", {a: 1, b:2, c: 3});

    storage.create("array", [1,2,3]);

    storage.create("arr string", ["a", "b", "c"]);

    storage.create("string", "some random text and stuff")
```

## erase
```sh
    storage.erase("array");

    storage.erase("object").then(err => { /* possible errors during deleting LocalStorage entry */})
```

## reset
```sh
    storage.reset();

    storage.reset(err => { /* possible errors during deleting all LocalStorage entries */})
```
Be careful using this as other web apps may also use local storage!

## insert
```sh
    storage.insert("array", [5,6])

    storage.insert("array", 5)

    storage.insert("arr string", "teste")

    storage.insert("object", {d: 1, e:2})

    storage.insert("string", "aaaaa")
```

# [RoadMap](www.github.com/Ribeiro-Tiago/local-storage/projects/1)

# MIT License