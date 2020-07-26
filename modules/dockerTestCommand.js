const { linuxCommand } = require("./linuxCommand");
const { addData, searchData, removeData } = require("../config/dbConfig");

async function dockerStopContainer(containerName) {
  await linuxCommand(`docker stop ${containerName}`);
}

async function dockerRemoveContainer(containerName) {
  await linuxCommand(`docker rm ${containerName}`);
}

async function dockerScaleContainerNoVolume(data, maxScale) {
  const portRange = parseInt(data.portRange);
  const oldData = await searchData("containers", { containerImage: data.imageID });
  const length = oldData.length;
  if (length < maxScale) {
    for (let i = length; i < maxScale; i++) {
      await linuxCommand(
        `docker run -it -d -p ${portRange + i}:${data.containerPort} --name a${data.imageID}${i} ${data.imageID}`
      );
      await addData("containers", {
        containerImage: data.imageID,
        number: i,
        name: `a${data.imageID}${i}`,
        port: `${portRange + i}`,
      });
    }
  } else if (length > maxScale) {
    const difference = length - maxScale;
    for (let i = length; i > length - difference; i--) {
      await dockerStopContainer(`a${data.imageID}${i - 1}`);
      await dockerRemoveContainer(`a${data.imageID}${i - 1}`);
      const removeContainer = await searchData("containers", { containerImage: data.imageID, number: i - 1 });
      await removeData("containers", removeContainer[0]._id);
    }
  } else return;
}

async function dockerScaleContainerWithVolume(data, maxScale) {
  const portRange = parseInt(data.portRange);
  const oldData = await searchData("containers", { containerImage: data.imageID });
  const length = oldData.length;
  if (length < maxScale) {
    for (let i = length; i < maxScale; i++) {
      await linuxCommand(
        `docker run -it -d -p ${portRange + i}:${data.containerPort} -v ${data.hostVolume}:${
          data.containerVolume
        } --name a${data.imageID}${i} ${data.imageID}`
      );
      await addData("containers", {
        containerImage: data.imageID,
        number: i,
        name: `a${data.imageID}${i}`,
        port: `${portRange + i}`,
      });
    }
  } else if (length > maxScale) {
    const difference = length - maxScale;
    for (let i = length; i > length - difference; i--) {
      await dockerStopContainer(`a${data.imageID}${i - 1}`);
      await dockerRemoveContainer(`a${data.imageID}${i - 1}`);
      const removeContainer = await searchData("containers", { containerImage: data.imageID, number: i - 1 });
      await removeData("containers", removeContainer[0]._id);
    }
  } else return;
}

//module.exports = { dockerScaleContainerWithVolume, dockerScaleContainerNoVolume };
