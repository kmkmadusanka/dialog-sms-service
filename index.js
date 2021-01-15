/**
 * RichCommunicationTM
 * API Integration
 * v4.2.1
 * Documentation link : https://drive.google.com/file/d/1hpv89ZSgfN58O9rdRFwsVLaFRyipziRw/view?usp=sharing
 *  */

// import axios to send API calls.
const axios = require('axios');
// global variable that holds config values.
let chat_configurations = {};
// url for the RichCommunication sms gateway.
const url = 'https://richcommunication.dialog.lk/api/sms/send';

/**
 * Function to set configuration variables.
 * @param {string} digest The string
 * @param {string} mask The string
 * @param {string} user The string
 * @param {string} campaignName The string
 * @return {Promise} Result
 */
module.exports.setConfig = ({ digest, mask, user, campaignName }) => {
  return new Promise((resolve, reject) => {
    // validate function inputs
    if (typeof digest !== 'string') {
      reject(`Dialog SMS setConfig error : 'digest' should be String value.`);
    }
    if (typeof mask !== 'string') {
      reject(`Dialog SMS setConfig error : 'mask' should be String value.`);
    }
    if (typeof user !== 'string') {
      reject(`Dialog SMS setConfig error : 'user' should be String value.`);
    }
    if (campaignName && typeof campaignName !== 'string') {
      reject(
        `Dialog SMS setConfig error : 'campaignName' should be String value.`
      );
    }
    // assign empty string for campaignName
    if (!campaignName) {
      campaignName = '';
    }

    // set variables to global variable
    chat_configurations = { url, digest, mask, user, campaignName };
    resolve(chat_configurations);
  });
};

/**
 * Function that sends the SMS
 * @param {string} senderPhone A string
 * @param {string} message The SMS content
 * @return {Promise} Result
 */
module.exports.sendSMS = (senderPhone, message) => {
  return new Promise(async (resolve, reject) => {
    // validate function inputs
    if (typeof senderPhone !== 'string' || senderPhone.length < 10) {
      reject(
        `Dialog SMS sendSMS error : 'senderPhone' should be String value which has length of at least 10 characters.`
      );
    }
    if (typeof message !== 'string') {
      reject(`Dialog SMS sendSMS error : 'message' should be String value.`);
    }

    let To = senderPhone;
    // destructor required fields from config
    const { digest, mask, user, campaignName } = chat_configurations;

    // replace first character of phone number 0 with 94
    To = replaceZero(To);

    // create time stamp for message sending
    const timeStamp = getUnixTime();

    //post sms
    resolve(
      await postMessage(
        To,
        mask,
        message,
        digest,
        user,
        timeStamp,
        campaignName
      )
    );
  });
};

/**
 * Function that replace 0 with 94
 * @param {string} numbers A string phone number/s
 * @return {string} Result
 */
const replaceZero = (numbers) => {
  let To = numbers;
  if (To.includes(',')) {
    // replace multiple phone numbers 0 with 94
    To = To.split(',')
      .map((elem) => {
        if (elem.charAt('0')) {
          return elem.replace('0', '94');
        } else {
          return elem;
        }
      })
      .join(',');
  } else {
    // replace single phone number 0 with 94
    if (To.charAt('0')) {
      To = To.replace('0', '94');
    }
  }

  return To;
};

/**
 * Function that produce UNIX time of the current time
 * @return {string} Result
 */
const getUnixTime = () => {
  const time = new Date().toString().split(' ')[4];
  const date = `${new Date().toLocaleDateString().split('/')[2]}-${
    new Date().toLocaleDateString().split('/')[0]
  }-${new Date().toLocaleDateString().split('/')[1]}`;

  return `${date}T${time}`;
};

/**
 * Function that POST the SMS
 * @param {string} To A string
 * @param {string} mask A string
 * @param {string} digest A string
 * @param {string} user A string
 * @param {string} timeStamp A string
 * @param {string} campaignName A string
 * @param {string} message The SMS content
 * @return {Promise} Result
 */
const postMessage = (
  To,
  mask,
  message,
  digest,
  user,
  timeStamp,
  campaignName
) => {
  return new Promise(async (resolve, reject) => {
    // request body creation
    const body = {
      messages: [
        {
          clientRef: new Date().valueOf(),
          number: To,
          mask: mask,
          text: message,
          campaignName: campaignName,
        },
      ],
    };

    // send sms with appropriate data.
    axios({
      method: 'post',
      url: url,
      data: body,
      headers: {
        USER: user,
        DIGEST: digest,
        CREATED: timeStamp,
      },
    })
      .then((res) => {
        resolve(res['data']);
      })
      .catch((error) => {
        reject(
          `${error['response']['status']}: ${error['response'][' statusText']}`
        );
      });
  });
};
