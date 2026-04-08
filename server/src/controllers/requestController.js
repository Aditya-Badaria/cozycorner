import Request from "../models/Request.js";

/**
 * Create a quote request
 * @route POST /api/requests
 * @access Private
 */
export const createRequest = async (req, res, next) => {
  try {
    const { architectId, message, budget, clientName, clientEmail } = req.body;
    const userId = req.user.id;

    console.log("📝 [Create Request] Received data:", {
      architectId,
      userId,
      clientName,
      budget,
    });

    // Validation
    if (!architectId || !message || !budget || !clientName || !clientEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (budget < 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a positive number",
      });
    }

    // Check if user is trying to request from themselves
    if (userId === architectId) {
      return res.status(400).json({
        success: false,
        message: "You cannot request a quote from yourself",
      });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      userId,
      architectId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request with this architect",
      });
    }

    const request = await Request.create({
      userId,
      architectId,
      message,
      budget,
      clientName,
      clientEmail,
    });

    console.log("✅ [Create Request] Saved to DB:", {
      requestId: request._id,
      architectId: request.architectId,
      userId: request.userId,
      clientEmail,
      budget,
    });

    res.status(201).json({
      success: true,
      message: "Quote request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("❌ Create request error:", error);
    next(error);
  }
};

/**
 * Get all requests for an architect
 * @route GET /api/requests/architect/:architectId
 * @access Private
 */
export const getArchitectRequests = async (req, res, next) => {
  try {
    const { architectId } = req.params;
    const { status = "pending" } = req.query;

    console.log("🔍 [Backend] Getting requests for architect:", architectId);
    console.log("🔍 [Backend] Filter status:", status);
    console.log("🔍 [Backend] Authenticated user:", req.user?.id);

    const query = { architectId };
    if (status) {
      query.status = status;
    }

    console.log("🔍 [Backend] MongoDB query:", JSON.stringify(query));

    const requests = await Request.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    console.log("✅ [Backend] Found requests:", requests.length);
    if (requests.length > 0) {
      console.log("📄 [Backend] Sample request:", {
        _id: requests[0]._id,
        architectId: requests[0].architectId,
        userId: requests[0].userId,
        clientName: requests[0].clientName,
        status: requests[0].status,
      });
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("❌ Get architect requests error:", error);
    next(error);
  }
};

/**
 * Get user's submitted requests
 * @route GET /api/requests/my-requests
 * @access Private
 */
export const getUserRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ userId })
      .populate("architectId", "name location pricing")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get user requests error:", error);
    next(error);
  }
};

/**
 * Update request status
 * @route PUT /api/requests/:requestId
 * @access Private
 */
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only architect can update the request
    if (request.architectId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update requests for your own profile",
      });
    }

    request.status = status;
    await request.save();

    console.log("Request status updated:", {
      requestId: request._id,
      oldStatus: request.status,
      newStatus: status,
    });

    res.status(200).json({
      success: true,
      message: "Request status updated",
      request,
    });
  } catch (error) {
    console.error("Update request error:", error);
    next(error);
  }
};

/**
 * Delete a request
 * @route DELETE /api/requests/:requestId
 * @access Private
 */
export const deleteRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only user who created the request can delete it
    if (request.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own requests",
      });
    }

    await Request.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error);
    next(error);
  }
};

export const deleteAllRequests = async (req, res, next) => {
  try {
    const result = await Request.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} requests`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete all requests error:", error);
    next(error);
  }
};
