import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import generateToken from '../utils/generateToken.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.USER1, 
    pass: process.env.PASSWORD,
  },
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      contact: user.contact,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// GET USER PROFILE
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      contact: user.contact,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Register a new user - Send verification link
const verificationLink = asyncHandler(async (req, res) => {
  const { name, email, password, contact, address } = req.body;
  const { phone_no } = contact;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email is already registered');
  }

  const validatename = name.length;
  const validateaddress = address.length;
  const validatePassword = password.length;

  if (validatename < 3) {
    res.status(400);
    throw new Error('Name must be of 3 characters or more length');
  }

  if (validateaddress < 5) {
    res.status(400);
    throw new Error('Address must be of 5 characters or more length');
  }
  if (validatePassword < 6) {
    res.status(400);
    throw new Error('Password length must be greater than 5');
  }

  const validateContact = contact.phone_no.length;
  if (validateContact !== 10) {
    res.status(400);
    throw new Error('Enter 10 digit mobile number');
  }

  if (!phone_no.startsWith('9')) {
    res.status(400);
    throw new Error('Mobile Number must start with 9');
  }

  const tokengenerate = jwt.sign(
    { name, email, password, contact, address },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  const mailOptions = {
    from: process.env.USER1,
    to: email,
    subject: 'Verify your account',
    html: `<p>Please click on the link below to activate your account</p>
           <a href="${process.env.EMAIL_URL}/verify/${tokengenerate}">${process.env.EMAIL_URL}/verify/${tokengenerate}</a>`,
  };

  // Send email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      res.status(400);
      throw new Error('Failed to send verification email');
    } else {
      console.log('Email sent:', info.response);
      res.status(201).json({
        response: 'A verification link has been sent to your Email. Verify it at first.',
      });
    }
  });
});

// Complete registration after verification
const registerUser = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, password, contact, address } = decoded;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('You have already been verified');
    } else {
      const user = await User.create({
        name,
        email,
        password,
        contact,
        address,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
          address: user.address,
          contact: user.contact,
        });
      } else {
        res.status(400);
        throw new Error('Invalid User Data');
      }
    }
  } else {
    res.status(404);
    throw new Error('No token found');
  }
});

// Send email to seller
const emailSend = asyncHandler(async (req, res) => {
  const { receiver, text, name, address, productName, email, phone_no } = req.body;
  console.log('user is', email);

  const mailOptions = {
    from: process.env.USER1,
    to: receiver,
    subject: 'You have a buyer',
    html: `<div style="background:#31686e;text-align:center;color:white">One of the KinBechSaman.com user wants
           to buy your ${productName}. </div><br/>
           <p>His/Her name is ${name} and is a resident of ${address}.His/Her
           email is: ${email} and registered contact no is: ${phone_no}.</p>
           He/She says:  ${text}`,
  };

  // Send email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      res.status(400);
      throw new Error('Failed to send email');
    } else {
      console.log('Email sent:', info.response);
      res.status(201).json({ response: 'Email Successfully Sent' });
    }
  });
});

// Get all users by admin only
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone_no } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    if (req.user._id.toString() === user._id.toString() || req.user.isAdmin) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.address = address || user.address;
      user.password = password || user.password;
      user.contact.phone_no = phone_no || user.contact.phone_no;

      const updatedUser = await user.save();
      res.status(201).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        contact: updatedUser.contact,
      });
    } else {
      res.status(401);
      throw new Error('You cannot perform this action');
    }
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (
    (user && user._id.toString() === req.user._id.toString()) ||
    req.user.isAdmin
  ) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  emailSend,
  getUsers,
  deleteUser,
  updateUserProfile,
  getUserById,
  verificationLink,
};