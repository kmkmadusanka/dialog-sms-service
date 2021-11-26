# Dialog SMS Service

![](https://img.shields.io/badge/Release-1.1.3-green)

**JavaScript library to send SMS through Dialog telecommunication service**

This library will handle single or multiple SMS send feature with Dialog telecommunications service.

`npm install dialog-sms-service `

## Usage

```javascript
const smsGateway = require('dialog-sms-service');

(async () => {
  try {
    // set configuration
    await smsGateway.setConfig({
      digest: 'dialog_msg_digest_here',
      mask: 'dialog_msg_mask_here',
      user: 'dialog_msg_user_here',
      campaignName: 'dialog_msg_campaignName_here', //optional
    });

    //send message
    const result = await smsGateway.sendSMS('07XXXXXXXX', 'Dialog sms test');
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();
```

## How to work

#### First needs to contact Dialog Axiata PLC to get credentials for the SMS gateway.

> **Note:-** Please contact [**Dialog Axiata PLC**](https://www.dialog.lk/browse/businessWithSubLevels.jsp?id=onlinefld70074) in order to obtain following fields.

| Field    | Description                                                   |
| -------- | ------------------------------------------------------------- |
| Username | User name for the Dialog SMS gateway account.                 |
| Password | Password for the Dialog SMS gateway account.                  |
| mask     | Text that appears as the sender of the SMS. **Eg:-** PIZZAHUT |

#### set configurations for the SMS gateway

```javascript
// set configuration
await smsGateway.setConfig({
  digest: 'dialog_msg_digest_here',
  mask: 'dialog_msg_mask_here',
  user: 'dialog_msg_user_here',
  campaignName: 'dialog_msg_campaignName_here', //optional
});
```

| Field        | Description                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| user         | _Required_. Username that will provided by Dialog.                                                                             |
| mask         | _Required_. A String. SMS sender ID.Mask value provided by Dialog. **Eg:-** test (For the test account)                        |
| digest       | _Required_. [md5 encripted](https://www.md5hashgenerator.com/) values of password. {digest = md5(password provided by dialog)} |
| campaignName | _Optional_. Campaign name to be used in reporting.                                                                             |

#### Send SMS

```javascript
await smsGateway.sendSMS(Phone Number ,Message);
```

| Field        | Description                                                                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phone Number | _Required_. A String. Phone number/s which will need to receive SMS. the phone number needs to either start with 0 or 94 (do not use +94). If there are multiple receivers make sure to add them as comma (,) separated text. Eg :- '0771111111,0712222222' |
| Message      | _Required_. A String. The content of the SMS goes here.                                                                                                                                                                                                     |

## Licence

(The MIT License)
Copyright (c) 2021 kmkasunmadushanka@gmail.com
