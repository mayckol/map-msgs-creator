![Message Map Creator](logo.png)

# Msgs Map Creator

This package is a command line tool that allows you to create messages.

## Install

```shell
npm install --dev msgs-map-creator
yarn add --dev msgs-map-creator
```

## Run

```shell
npx msgs-map-creator
```

## Usage

You can use the package by running the following command in the command line:

```
npm run --prefix node_modules/msgs-map-creator make
```

The package accepts the following options:

- `--keep-conf` or `-k`: Allows you to keep the previous configuration and use it for the current run.

### This topic explains the rule for creating customized messages from an original message.

<span style="color: yellow">It's only indicated in situations where there are no mapped status returns from some API, it should not be used as in the following example:

API RESPONSE

```json
{
  "message": "Bad request",
  "error_code": 45
}
```

```typescript
export enum ErrorCode {
  //...
  44 = 'Foo bar',
  45 = 'Error creating item. Please check the submitted data and try again.',
  46 = 'Foo bar',
  //...
}
```

<span style="color: yellow"> In the above case, it is possible to map the returns through the "error_code" key, there is no need to use the resource. </span>

## Util Case

<span style="color: green">The example below is indicated</span> for the case where we only receive a generic return message and we want to customize it.

Response:

```json
{
  "message": "Conflict in registering the purchase. Purchase already registered in the program previously."
}
```

In this case we can use the message response to create a key from map using a hash and customizing it to return a new message. Like:

### It's required a path input/output to handle it.

<span style="color: grey">Input (input.json)</span>

```json
[
  {
    "input": "Conflict in registering the purchase. Purchase already registered in the program previously.",
    "output": "This invoice has already been sent previously."
  }
]
```

<span style="color: green">Output (input.ts or .js)</span>

```typescript
const outputMessages = {
  '981adff0f66066d65186ae4204f0a830d8942c7c':
    'This invoice has already been sent previously.',
};
```

## Feel free to improve it!
