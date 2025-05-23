const prisma = require('../db/index');

// GET all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        assignment: {
          include: {
            volunteer: true,
            task: true,
          },
        },
      },
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

// GET attendance by ID
exports.getAttendanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: Number(id) },
      include: {
        assignment: {
          include: {
            volunteer: true,
            task: true,
          },
        },
      },
    });
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

// POST new attendance record
exports.createAttendance = async (req, res) => {
  const { assignId, checkInTime, hoursWorked } = req.body;
  try {
    const newAttendance = await prisma.attendance.create({
      data: {
        assignId,
        checkInTime: new Date(checkInTime),
        hoursWorked,
      },
    });
    res.status(201).json(newAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
};

// PUT update attendance
exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { checkOutTime, hoursWorked } = req.body;

  try {
    const updated = await prisma.attendance.update({
      where: { id: Number(id) },
      data: {
        checkOutTime: new Date(checkOutTime),
        hoursWorked,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

// DELETE attendance record
exports.deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.attendance.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
};
