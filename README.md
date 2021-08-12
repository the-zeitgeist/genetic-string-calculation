# genetic-string-calculation

This programm intends to reach a passed string by implementing genetic algorithms.

The program can be used by executing:

```javascript
  node geneticString.js
```

You can pass your desired string by using the `stringGoal` flag, in case you don't provide a string 'Politecnico Colombiano Jaime Isaza Cadavid' will be used as default

```javascript
  node geneticString.js --goalString 'My test string'
```

Additionally you can dismiss the parents log from your terminal by using the `noShow` flag, this log is displayed by default

```javascript
  node geneticString.js --noShow
```

The result will be saved into a csv file named `generationsResult.csv`

Author:

- Zeitgeist J
- Santiago Quiceno
