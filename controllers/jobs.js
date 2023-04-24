const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ items: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ createdBy: req.user.userID, _id: id });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id },
    body: { company, position },
  } = req;

  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userID },
    { company, position },
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id },
  } = req;
  const job = await Job.findOneAndDelete({ createdBy: userID, _id: id });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
