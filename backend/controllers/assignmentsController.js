const prisma = require('../db/index');
const transporter = require('../utils/email');

// GET all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await prisma.volunteerAssignment.findMany({
      include: {
        task: true,
        volunteer: true,
        attendance: true,
      },
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

// GET assignment by ID
exports.getAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await prisma.volunteerAssignment.findUnique({
      where: { id: Number(id) },
      include: {
        task: true,
        volunteer: true,
        attendance: true,
      },
    });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
};

exports.getAssignmentsByVolunteer = async (req, res) => {
  const { vol } = req.params;
  try {
    const assignments = await prisma.volunteerAssignment.findMany({
      where: {
        volId: Number(vol),
      },
      include: {
        task: {
          include: {
            event: true,
          },
        },
        attendance: true,
      },
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteer assignments' });
  }
};

// POST new assignment
exports.createAssignment = async (req, res) => {
  const { taskId, volId } = req.body;
  const existingAssignment = await prisma.volunteerAssignment.findFirst({
    where: {
      taskId: taskId,
      volId: volId,
    },
  });

  if (existingAssignment) {
    return res.status(400).json({ message: 'Volunteer already assigned to this task' });
  }

  try {

    const newAssignment = await prisma.volunteerAssignment.create({
      data: {
        taskId,
        volId,
        assignDate: new Date(),
        status: 'Assigned',
      },
      include: {
        task: {
          include: {
            event: {
              include: {
                organization: true,
              },
            },
          },
        },
        volunteer: true,
      },
    });

    const task = newAssignment.task;
    const event = task.event;
    const org = event.organization;
    const volunteer = newAssignment.volunteer;


    const mailOptions = {
      from: `"${org.name}" <${process.env.EMAIL_USER}>`,
      to: volunteer.email,
      subject: `Assignment Confirmation: ${task.name}`,
      text: `
Hello ${volunteer.firstName},

You have been assigned to the task: "${task.name}" for the event: "${event.name}".

📝 Description: ${task.description || 'No description'}
📅 Schedule Time: ${task.scheduleTime}
🏢 Organization: ${org.name}

If you have questions, feel free to reach out to us.

Best,
${org.name} Team
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json(newAssignment);
    console.log("Mail Sent ")
  } catch (err) {
    console.log(err);
    console.log("Mail Not sent")
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

// PUT update assignment
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { taskId, volId } = req.body;
  try {
    const updated = await prisma.volunteerAssignment.update({
      where: { id: Number(id) },
      data: { taskId, volId },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};

// DELETE assignment
exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.volunteerAssignment.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};
