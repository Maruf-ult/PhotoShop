import downloadModel from "../models/downloads.js";

export const downloadPhoto = async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = Path.join(__dirname, "..", "downloads", fileName);

    await downloadModel.create({
      userId: req.user.id,
      fileName,
      downloadedAt: new Date(),
    });
    return res.download(filePath, fileName, (err) => {
      if (err) {
        console.log(err);
        return req
          .status(500)
          .json({
            success: false,
            msg: `Error during download operation:${err}`,
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: `Enternal server eroor, ${error}`,
    });
  }
};

export const getDownloadHistory = async (req, res) => {
  try {
    const history = await downloadModel
      .find({ userId: req.user.id })
      .sort({ downloadedAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: `Error getting download history ${error}`,
    });
  }
};
