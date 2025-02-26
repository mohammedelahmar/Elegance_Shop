import Adresses from "../../models/Adresses";
import asyncHandler from "express-async-handler";
import { protect as authMiddleware } from "../../middlewares/authMiddleware";
import adminMiddleware from "../../middlewares/adminMiddleware";

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private

const addAdresse = asyncHandler(async (req, res) => {
   const { user, address, ville, country,code_postal, phone_number } = req.body;
   const adresse = new Adresses({
            user,
            address,
            ville,
            country,
            code_postal,
            phone_number
   });
   const createdAdresse = await adresse.save();
     res.status(201).json(createdAdresse);
});

// @desc    Get address by ID
// @route   GET /api/addresses/:id
// @access  Private

const getAdresseById = asyncHandler(async (req, res) => {
     const adresse = await Adresses.findById(req.params.id);
     if (adresse){
          res.json(adresse);
     }else{
          res.status(404);
          throw new Error('Address not found');
     }
});

//@desc   Get all addresses
//@route  GET /api/addresses
//@access Private/Admin

const getAllAdresses = asyncHandler(async (req, res) => {
     const asdresses = await Adresses.find({});
     res.json(asdresses);
}
);

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private

const updateAdresse = asyncHandler(async (req, res) => {
     const { user, address, ville, country,code_postal, phone_number } = req.body;
     const adresse = await Adresses.findById(req.params.id);

     if(adresse){
          adresse.user = user;
          adresse.address = address;
          adresse.ville = ville;
          adresse.country = country;
          adresse.code_postal = code_postal;
          adresse.phone_number = phone_number;
     }
     const updatedAdresse = await adresse.save();
     res.json(updatedAdresse);
}
);

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private

const deleteAdresse = asyncHandler(async (req, res)=>{
     const adresse = await Adresses.findById(req.params.id);
     
     if(adresse){
          await adresse.remove();
          res.json({message: 'Address removed'});
     }
     else{
          res.status(404);
          throw new Error('Address not found');
     }
});

export { addAdresse, getAdresseById, getAllAdresses, updateAdresse, deleteAdresse };

