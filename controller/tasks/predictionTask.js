const Tasks = require("../../models/Tasks.js");
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

const predictionTask = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401);

    try {
        const tasks = await Tasks.findAll({
          where: {
            user_id: userId
          },
          attributes: ["name", "category", "priority"]
        });
    
        if (!tasks) {
          return res.status(404).json({
            error: true,
            message: "Tasks not found",
          });
        }
        // return res.status(200).json(tasks);
        const name = tasks[0].name;
        const category = tasks[0].category;
        const priority = tasks[0].priority;

        const getPrediction = await axios.post(process.env.ML_API_TASK, [{
            nama_kegiatan: name,
            kategori: category,
            prioritas: priority
        }]);
        const predictedTask = getPrediction.data;
        if(predictedTask) {
            return res.json(predictedTask);
        }
      } catch (error) {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      }
    
    
};

module.exports = predictionTask;