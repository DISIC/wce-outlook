import CONFIG from './config.js'

// -----------------------------------------------------------------
Office.initialize = function () {};

// -----------------------------------------------------------------
async function Fill(event) {
  try {
    const result = await AddLocationToInvitation(GenerateRoomName());
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    event.completed();
  }
}

// -----------------------------------------------------------------
function GenerateRoomName() {
  try {
    return CONFIG.JITSI_ROOM_NAME_FORMAT;
  } catch (error) {
    console.error(error);
  }
}

// -----------------------------------------------------------------
function GetUrl(roomName) {
  try {
    return "https://" + CONFIG.ROOT_JITSI_DOMAIN + "/" + roomName;
  } catch (error) {
    console.error(error);
  }
}

// -----------------------------------------------------------------
function load(url) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

// -----------------------------------------------------------------
function AddLocationToInvitation(roomName) {
  return new Promise((resolve, reject) => {
    try {
      let url = GetUrl(roomName);

      if (Office.context.mailbox.item.location) {
        Office.context.mailbox.item.location.getAsync((getResult) => {
          try {
            if (getResult.status == Office.AsyncResultStatus.Failed) {
              console.error(`Action failed with message ${typeResult.error.message}`);
            } else {
              var location = getResult.value;

              if (location) {
                location += ";" + url;
              } else {
                location = url;
              }

              Office.context.mailbox.item.location.setAsync(location, (result) => {
                try {
                  if (result.status !== Office.AsyncResultStatus.Succeeded) {
                    console.error(`Action failed with message ${result.error.message}`);
                    reject(result.error);
                  }
                  console.log(`Successfully set location to ${url}`);

                  if (Office.context.mailbox.item.body) {
                    let phoneNumbers = "";
                    let pinCode = "";

                    if (CONFIG.ENABLE_PHONE_ACCESS) {
                      try {
                        let result = JSON.parse(
                          load(`${CONFIG.PHONE_NUMBERS_API_URL}?conference=${roomName}@conference.${CONFIG.ROOT_JITSI_DOMAIN}`)
                        ).numbers;

                        if (result) {
                          Object.keys(result).forEach((key) => {
                            result[key].forEach((number) => {
                              phoneNumbers += CONFIG.PHONE_NUMBER_FORMAT.replace("%phone_number%", number).replace(
                                "%phone_country%",
                                key
                              );
                            });
                          });
                        }
                      } catch (error) {
                        console.error(error);
                      }
                      try {
                        pinCode = JSON.parse(
                          load(`${CONFIG.PHONE_PIN_CODE_API_URL}?conference=${roomName}@conference.${CONFIG.ROOT_JITSI_DOMAIN}`)
                        ).id;
                      } catch (error) {
                        console.error(error);
                      }
                    }

                    let htmlBodyUrl = load(CONFIG.INVITE_TEMPLATE_FILE)
                      .replaceAll("%url%", url)
                      .replaceAll("%desktop_url%", url.replace("https", "wce-appli-bureau"))
                      .replaceAll("%phone_numbers%", phoneNumbers)
                      .replaceAll("%pin_code%", pinCode);

                    Office.context.mailbox.item.body.getAsync(Office.CoercionType.Html, function (getResult) {
                      try {
                        if (getResult.status == Office.AsyncResultStatus.Failed) {
                          console.error(`Action failed with message ${typeResult.error.message}`);
                          reject(result.error);
                        } else {
                          var body = getResult.value;

                          body += htmlBodyUrl;

                          Office.context.mailbox.item.body.setAsync(
                            body,
                            { coercionType: Office.CoercionType.Html },
                            (result) => {
                              try {
                                if (result.status !== Office.AsyncResultStatus.Succeeded) {
                                  console.error(`Action failed with message ${result.error.message}`);
                                  reject(result.error);
                                }
                                console.log(`Successfully set body`);

                                resolve("AddLocationToInvitation resolved");
                              } catch (error) {
                                console.error(error);
                                reject(error);
                              }
                            }
                          );
                        }
                      } catch (error) {
                        console.error(error);
                        reject(error);
                      }
                    });
                  }
                } catch (error) {
                  console.error(error);
                  reject(error);
                }
              });
            }
          } catch (error) {
            console.error(error);
            reject(error);
          }
        });
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

// -----------------------------------------------------------------
Office.actions.associate("Fill", Fill);
