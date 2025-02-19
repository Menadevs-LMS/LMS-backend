const Course = require("../../models/Course");
const CategoreSchema = require("../../models/Categories");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const categoreName = req.body.category;
    const categore = await CategoreSchema.find({ categoreName: categoreName });

    if (!categore) {
      const newCategore = new CategoreSchema(categoreName);
      await newCategore.save();
    }

    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();
    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const searchAndFilterCourses = async (req, res) => {
  try {
    const { title, categories } = req.body;
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    };
    if (categories) {
      const categoryArray = categories.split(",");
      query.category = { $in: categoryArray }
    }
    const courses = await Course.find(query);
    res.status(200).json({
      success: true,
      message: "Courses found",
      courses: courses
    });
  } catch (error) {
    console.log(error)
  }
}

// const getCoursesByCategoreis = async (req, res) => {
//   try {
//     let categories = req.body.categories;

//     if (!categories) {
//       return res.status(400).json({
//         message: "Categories are required"
//       });
//     }
//     categories = categories.split(",");
//     const courses = await Course.find({ category: { $in: categories } });
//     res.json(courses);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error", error });

//   }
// }

// const searchCoursesByTitle = async (req, res) => {
//   try {
//     const title = req.body.title;
//     if (!title) {
//       return res.status(400).json({ messages: "Title is required" });
//     }
//     const coures = await Course.find({ title: { $regex: title, $options: 'i' } });

//     res.status(200).json({
//       success: true,
//       message: "Courses found",
//       coures: coures
//     })

//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });

//   }
// }

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  searchAndFilterCourses,

  // getCoursesByCategoreis,
};
