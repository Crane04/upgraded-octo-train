import { Request, Response } from "express";
import CreatePack from "../services/pack/createPack";
import JoinPack from "../services/pack/joinPack";
import getUserBySessionToken from "../services/users/getUserBySessionToken";
import ApiResponse from "../helpers/ApiResponse";
import LeavePack from "../services/pack/leavePack";
import GetUserPack from "../services/pack/getPackByUser";
import GetPack from "../services/pack/getPack";
import PackProfiles from "../services/pack/getPackProfiles";
import getUserByUsername from "../services/users/getUserByUsername";
import summarizeFamily from "../AI/summarizeFamily";
import { User } from "../db/users";

class PackControllers {
  static createPack = async (req: Request, res: Response): Promise<any> => {
    const { name } = req.body;
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const getUser = await getUserBySessionToken(sessionToken);

    const newPack = await CreatePack.run(name, getUser._id);

    ApiResponse.success(res, "Pack created successfully", newPack);
  };

  static joinPack = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;

    console.log("here oooo")
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const getUser = await getUserBySessionToken(sessionToken);

    const joinedPack = await JoinPack.run(getUser._id, id);

    ApiResponse.success(res, "Joined pack successfully", joinedPack);
  };

  static leavePack = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.body;
      const sessionToken =
        req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

      const user = await getUserBySessionToken(sessionToken);
      if (!user) {
        return ApiResponse.error(res, "User not found", 404);
      }

      const pack = await LeavePack.run(user._id.toString(), id);

      ApiResponse.success(res, "Left pack successfully", pack);
    } catch (error) {
      ApiResponse.error(res, "Failed to leave pack", 500);
    }
  };

  static getPack = async (req: Request, res: Response): Promise<any> => {
    try {
      const sessionToken =
        req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

      const getPack = await GetUserPack.getBySessionToken(sessionToken);
      if (!getPack) {
        return ApiResponse.error(res, "Pack not found", 404);
      }
      const { name, uniqueID } = getPack;
      ApiResponse.success(res, "Pack retrieved successfully", {
        name,
        uniqueID,
      });
    } catch (error) {
      ApiResponse.error(res, "Failed to retrieve pack", 500);
    }
  };

  static getPackMembers = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const sessionToken =
        req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

      if (!id) {
        return res.status(400).json({ message: "Pack ID is required" });
      }

      const pack = await GetUserPack.getBySessionToken(sessionToken);
      if (!pack || pack.uniqueID !== id) {
        ApiResponse.error(res, "User not in this pack", 403);
        return;
      }

      const members = await GetPack.byId(id).members();

      if (!members) {
        ApiResponse.error(res, "Pack not found", 404);
        return;
      }

      ApiResponse.success(
        res,
        "Members retrieved successfully",
        members.members
      );
      return;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to get pack members" });
    }
  };
  static getPackProfiles = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const { username, medicalIssue } = req.body;

      const getUser = await getUserByUsername(username);
      if (!getUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const pack = await GetUserPack.getById(getUser._id.toString());
      if (!pack) {
        return res.status(404).json({ message: "Pack not found" });
      }

      const uniqueID = pack.uniqueID;

      const packProfiles = new PackProfiles();
      const profiles = await packProfiles.getMembersWithProfiles(uniqueID);
      const isUserPopulated = (user: any): user is User => {
        return typeof user === "object" && "username" in user;
      };
      const formattedProfiles = profiles
        .map((profile) => {
          const username = isUserPopulated(profile.user)
            ? profile.user.username
            : "Unknown user";
          const previousHospitals = profile.previousHospitals
            .map(
              (hospital: any) =>
                `Visited ${hospital.hospitalName} on ${new Date(
                  hospital.dateVisited
                ).toLocaleDateString()}`
            )
            .join("\n");

          const medicalHistories = profile.medicalHistory
            .map(
              (history: any) =>
                `${history.history} (on ${new Date(
                  history.date
                ).toLocaleDateString()})`
            )
            .join("\n");

          const allergies = profile.allergies
            .map(
              (allergy: any) =>
                `${allergy.allergy} (identified on ${new Date(
                  allergy.date
                ).toLocaleDateString()})`
            )
            .join("\n");

          const additionalNotes = profile.additionalNotes
            .map(
              (note: any) =>
                `${note.note} (on ${new Date(note.date).toLocaleDateString()})`
            )
            .join("\n");

          return `User: ${username}, Date of Birth: ${new Date(
            profile.dateOfBirth
          ).toLocaleDateString()}, Blood Group: ${
            profile.bloodGroup || "Not specified"
          }, Phone Number: ${profile.phoneNumber || "Not provided"}\n
  Previous Hospitals:\n${previousHospitals || "No previous hospitals"}\n
  Medical History:\n${medicalHistories || "No medical history"}\n
  Allergies:\n${allergies || "No allergies"}\n
  Additional Notes:\n${additionalNotes || "No additional notes"}`;
        })
        .join("\n\n");

      // Get summary using the summarizeFamily function
      const summary = await summarizeFamily(
        formattedProfiles,
        username,
        medicalIssue
      );

      ApiResponse.success(res, `${username} medical history`, { summary });
      return;
    } catch (error) {
      console.error("Error in getPackProfiles:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };
}

export default PackControllers;
