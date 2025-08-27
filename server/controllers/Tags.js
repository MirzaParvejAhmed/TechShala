const Category = require("../models/Tags")
const Course = require("../models/Course");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
//create tag ka handler function

exports.createcategory = async (req, res) => {
    try {
        ///fetch data 
        const { name, description } = req.body
        //validate data
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            })
        }
        //create entry in db
        const tagdetails = await Category.create({
            name: name,
            description: description
        });
        console.log("category details---->", tagdetails);
        //return response
        res.status(200).json({
            success: true,
            message: "Categories created successfully",
        })


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Category not created"
        })
    }
};


//get all tags handler function likho

exports.getAllcategories = async (req, res) => {
    try {
        const alltags = await Category.find({}, { name: true, description: true });
        //koi criteria nhi h lekin name or desc.zrur hona chahiye
        res.status(200).json({
            success: true,
            message: "All tags fetched successfully",
            Allcategories: alltags
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching all tags"
        })
    }
}

//tags page details handler->most popular courses
//dofferent courses  show krnaa 

exports.categorypagedetails = async (req, res) => {
    try {
        //get category id/tag id
        const {categoryid}= req.body;
        //console.log("category id--->",categoryid )
        //get courses for speicific category id
        const selectedcategory = await Category.findById( categoryid ).populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingandreviews",
        }).exec();
       //console.log("selectedcategory--->",selectedcategory)
        //validation
        if (!selectedcategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        //get copurses from different categpriws
       // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryid },
      })
       let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()//ne=not equal

        //get top popular courses
        const toppopularcourses = await Course.find().sort({ rating: -1 }).limit(5);

        //top seling couses
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate:{
                    path:"instructor"
                }
            })
            .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        //return response
        // console.log("differentcategories---->",differentCategory)
        res.status(200).json({
            success: true,
            data: {
                Selectedcategory: selectedcategory,
                Differentcategories: differentCategory,
                MostSellingCourses: mostSellingCourses
            }
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching category page details"
        })

    }
}