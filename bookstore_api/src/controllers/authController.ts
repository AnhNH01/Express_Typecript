import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { dataSource } from "../app-data-source";
import { Admin } from "../entity/admin.entity";
import { Customer, Gender } from "../entity/customer.entity";
import { DevEnv } from "../environment/dev.env";
import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { comparePassword, hashPassword } from "../utils/password.utils";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, confirmPassword, phoneNumber, gender } =
    req.body;

  if (!name || !email || !password || !confirmPassword || !phoneNumber) {
    return next(new BadRequestError("Please fill in all required fields"));
  }

  if (gender && !Object.values(Gender).includes(gender)) {
    return next(new BadRequestError("Invalid gender value."));
  }

  const customerRepository = dataSource.getRepository(Customer);
  if (!customerRepository)
    return next(new InternalServerError("Something went wrong!"));

  const registeredEmail = await customerRepository.findOneBy({
    email: email,
  });
  if (registeredEmail)
    return next(
      new BadRequestError(
        "Email is already in use, please use a different email."
      )
    );

  const registeredPhoneNumber = await customerRepository.findOneBy({
    phoneNumber: phoneNumber,
  });
  if (registeredPhoneNumber)
    return next(
      new BadRequestError(
        "This phone number is already registered, please use a different phone number."
      )
    );

  if (password !== confirmPassword)
    return next(
      new BadRequestError("Password and confirm password must match.")
    );

  const { salt, hashedPassword } = await hashPassword(password);

  const newCustomer = Customer.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    gender: gender || null,
  });

  await newCustomer.save();
  if (newCustomer.hasId()) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      id: newCustomer.id,
    });
  } else {
    return next(new InternalServerError("Something went wrong."));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new BadRequestError("Invalid Credentials."));

  const customerRepository = dataSource.getRepository(Customer);
  if (!customerRepository)
    return next(new InternalServerError("Something went wrong!"));

  const registeredUser = await customerRepository.findOneBy({
    email: email,
  });

  if (!registeredUser) return next(new BadRequestError("User does not exist"));

  const RealPassword: string = registeredUser.password;
  const isPasswordCorrect = await comparePassword(password, RealPassword);

  if (!isPasswordCorrect)
    return next(new BadRequestError("Email or password is incorrect."));

  const token = jwt.sign(
    {
      id: registeredUser.id,
      name: registeredUser.name,
      role: "customer",
    },
    DevEnv.JWT_SECRET,
    { expiresIn: DevEnv.JWT_LIFETIME }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    accessToken: token,
  });
};

export const adminRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword)
    return next(new BadRequestError("Please fill all required fields."));

  if (confirmPassword !== password)
    return next(
      new BadRequestError("Password and confirm password must match.")
    );

  const { hashedPassword } = await hashPassword(password, 10);

  const newAdmin = Admin.create({
    email: email,
    password: hashedPassword,
  });

  await newAdmin.save();
  if (newAdmin.hasId()) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      id: newAdmin.id,
    });
  } else {
    return next(new InternalServerError("Something went wrong."));
  }
};

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new BadRequestError("Enter email and password"));

  const adminRepository = dataSource.getRepository(Admin);
  const registeredAdmin = await adminRepository.findOneBy({
    email: email,
  });

  if (!registeredAdmin)
    return next(new BadRequestError("Email or password is wrong"));

  const validPassword = await comparePassword(
    password,
    registeredAdmin.password
  );
  if (validPassword) {
    const token = jwt.sign(
      {
        id: registeredAdmin.id,
        role: "admin",
      },
      DevEnv.JWT_SECRET,
      { expiresIn: DevEnv.JWT_LIFETIME }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      accessToken: token,
    });
  } else {
    return next(new BadRequestError("Email or password is wrong"));
  }
};
