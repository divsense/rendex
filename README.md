# rendex

## Types
```javascript

Spec :: {
    component :: String
    branch :: [Spec]
}

Component :: {
    name :: String
    openParams :: [Any]
    closeParams :: [Any]
    open :: () -> [Any] -> Void
    close :: () -> [Any] -> Void
}

```

