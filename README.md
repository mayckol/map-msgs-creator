![Message Map Creator](logo.png)

# Msgs Map Creator

This package is a command line tool that allows you to create messages.

## Install

```shell
npm install --dev msgs-map-creator
yarn add --dev msgs-map-creator
```

## Usage

### You are free to use the follow template or start a command line. Just create a json file in your root project (mmcconfig.json)

File Structure
The mmcconfig.json file consists of the following properties:

- `filePaths`: An array of objects that specify the input and output paths of your project's files. The objects in this array should have two properties: inputPath and outputPath. The inputPath property specifies the path of the input file and the outputPath property specifies the path of the output file.

- `headerDescription`: A string that provides a description for the header in your output file.

- `prettyOutput`: A boolean that specifies whether to format the output file in a readable manner or not. If set to true, the output file will be formatted in a readable manner, and if set to false, the output file will not be formatted.

- `hashType`: A string that specifies the type of hash to be used in your project. This property can be set to one of the following values: "md5", "sha1", "sha256", "sha512".
- `chosenLanguage`: The lang path to get the value from the key.

```json
{
  "filePaths": [
    {
      "inputPath": "/tmp/es.json",
      "outputPath": "/tmp/es.ts"
    },
    {
      "inputPath": "/tmp/en-us.json",
      "outputPath": "/tmp/en-us.ts"
    },
    {
      "inputPath": "/tmp/pt-br.json",
      "outputPath": "/tmp/pt-br.ts"
    }
  ],
  "headerDescription": "This file is auto-generated. Do not edit.",
  "prettyOutput": true,
  "hashType": "md5",
  "chosenLanguage": "/tmp/en-us.ts"
}
```

To use the package, run the following command in the command line:

## Execution

```shell
npx msgs-map-creator
```

The package accepts the following options:

- `--keep-conf` or `-k`: Allows you to keep the previous configuration and use it for the current run.

## Creating Custom Messages

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
const outPutMessages = {
  '981adff0f66066d65186ae4204f0a830d8942c7c':
    'This invoice has already been sent previously.',
};
```

### You can merge with the current map like:

```typescript
// i18n file
export { enUs, ...outPutMessages }
```

### I'm working hard to improve the cli, there are a known issues which will be fixed in the next releases, at the moment you can use the template to avoid some errors in the in handle user input paths. But if the paths exist you probably will have success 🚀

## Feel free to improve it!
