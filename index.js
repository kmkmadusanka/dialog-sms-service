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
    if (typeof digest === 'string') {
      if (typeof mask === 'string') {
        if (typeof user === 'string') {
          if (!campaignName || typeof campaignName === 'string') {
            // assign empty string for campaignName
            if (!campaignName) {
              campaignName = '';
            }
            // set variables to global variable
            chat_configurations = { url, digest, mask, user, campaignName };
            resolve(chat_configurations);
          } else {
            reject(
              `Dialog SMS setConfig error : 'campaignName' should be String value.`
            );
          }
        } else {
          reject(`Dialog SMS setConfig error : 'user' should be String value.`);
        }
      } else {
        reject(`Dialog SMS setConfig error : 'mask' should be String value.`);
      }
    } else {
      reject(`Dialog SMS setConfig error : 'digest' should be String value.`);
    }
  });
};

/**
 * Function that sends the SMS
 * @param {string} senderPhone The string
 * @param {string} message The SMS content
 * @return {Promise} Result
 */
module.exports.sendSMS = (senderPhone, message) => {
  return new Promise((resolve, reject) => {
    if (typeof senderPhone === 'string' && senderPhone.length >= 10) {
      if (typeof message === 'string') {
        let To = senderPhone;
        // destructor required fields from config
        const { url, digest, mask, user, campaignName } = chat_configurations;

        // replace first character of phone number 0 with 94
        if (To.includes(',')) {
          // replace multiple phone numbers 0 with 94
          let newPhoneNumbers = '';
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

        // create time stamp for message sending
        const time = new Date().toString().split(' ')[4];
        const date = `${new Date().toLocaleDateString().split('/')[2]}-${
          new Date().toLocaleDateString().split('/')[0]
        }-${new Date().toLocaleDateString().split('/')[1]}`;
        const timeStamp = `${date}T${time}`;

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
      } else {
        reject(`Dialog SMS sendSMS error : 'message' should be String value.`);
      }
    } else {
      reject(
        `Dialog SMS sendSMS error : 'senderPhone' should be String value which has length of 10 to 15.`
      );
    }
  });
};
