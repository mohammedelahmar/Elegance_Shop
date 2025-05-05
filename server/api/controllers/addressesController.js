import Adresses from "../../models/Adresses.js";
import asyncHandler from "express-async-handler";

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private

const addAdresse = asyncHandler(async (req, res) => {
   // Rename ville to city and code_postal to postal_code to match model schema
   const { user, address, city, country, postal_code, phone_number } = req.body;
   const adresse = new Adresses({
            user: user || req.user._id, // Default to logged in user if not provided
            address,
            city,                  // Changed from ville to city
            country,
            postal_code,          // Changed from code_postal to postal_code
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
     } else {
          res.status(404);
          throw new Error('Address not found');
     }
});

//@desc   Get all addresses
//@route  GET /api/addresses
//@access Private/Admin

const getAllAdresses = asyncHandler(async (req, res) => {
     const addresses = await Adresses.find({});
     res.json(addresses);
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private

const updateAdresse = asyncHandler(async (req, res) => {
     // Also fix the update function
     const { user, address, city, country, postal_code, phone_number } = req.body;
     const adresse = await Adresses.findById(req.params.id);

     if(adresse){
          adresse.user = user || adresse.user;
          adresse.address = address || adresse.address;
          adresse.city = city || adresse.city;         // Changed from ville to city
          adresse.country = country || adresse.country;
          adresse.postal_code = postal_code || adresse.postal_code;   // Changed from code_postal to postal_code
          adresse.phone_number = phone_number || adresse.phone_number;
          
          const updatedAdresse = await adresse.save();
          res.json(updatedAdresse);
     } else {
          res.status(404);
          throw new Error('Address not found');
     }
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private

const deleteAdresse = asyncHandler(async (req, res) => {
     const adresse = await Adresses.findById(req.params.id);
     
     if(adresse){
          await adresse.deleteOne();
          res.json({message: 'Address removed'});
     } else {
          res.status(404);
          throw new Error('Address not found');
     }
});

export { addAdresse, getAdresseById, getAllAdresses, updateAdresse, deleteAdresse };

