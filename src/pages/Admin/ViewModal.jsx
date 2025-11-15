import {
  User,
  MapPin,
  Calendar,
  ImageIcon,
  Wifi,
  Bed,
  Phone,
  Star,
  Home,
  X,
  ImagesIcon,
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export const ViewModal = ({ mess, isOpen, onClose }) => {
  if (!isOpen || !mess) return null;
console.log(mess)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Mess Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Images Gallery */}
          {mess.image && mess.image.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ImagesIcon className="w-5 h-5" />
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mess.image.map((img, index) => (
                  <div
                    key={img._id || index}
                    className="relative aspect-video rounded-lg overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt={`${mess.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Title
                </label>
                <p className="text-gray-900 font-medium">{mess.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Price
                </label>
                <p className="text-gray-900 font-semibold">
                  ৳{mess.payPerMonth?.toLocaleString()} / month
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status {" "}
                </label>
                <Badge
                  variant="outline"
                  className={`mt-1 ${
                    mess.status === "free"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : mess.status === "booked"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {mess.status || "Unknown"}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Room Type
                </label>
                <p className="text-gray-900">{mess.roomType || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Gender Preference
                </label>
                <p className="text-gray-900">
                  {mess.genderPreference || "Any"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Available From
                </label>
                <p className="text-gray-900">
                  {mess.availableFrom
                    ? new Date(mess.availableFrom).toLocaleDateString()
                    : "Immediately"}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>
            <div className="space-y-2">
              <p className="text-gray-900">
                <strong>Address:</strong> {mess.address}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {mess.description || "No description provided."}
            </p>
          </div>

          {/* Facilities & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Facilities
              </h3>
              {mess.facilities && mess.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mess.facilities.map((facility, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700"
                    >
                      {facility}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No facilities listed</p>
              )}
            </div>

            {/* Room Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Room Features
              </h3>
              {mess.roomFeatures && mess.roomFeatures.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mess.roomFeatures.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-50 text-green-700"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No room features listed</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Contact Number
                </label>
                <p className="text-gray-900">{mess.contact || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Owner Name
                </label>
                <p className="text-gray-900">{mess.owner_name || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Owner Email
                </label>
                <p className="text-gray-900">{mess.owner_email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Owner Phone
                </label>
                <p className="text-gray-900">{mess.owner_phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Ratings & Views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Ratings
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>Total Reviews:</strong>{" "}
                  {mess.ratingInfo?.totalReviews || 0}
                </p>
                <p className="text-gray-900">
                  <strong>Rating:</strong>{" "}
                  {mess.ratingInfo?.detailedRating || "No ratings yet"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Statistics
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>Views:</strong> {mess.view || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created Date
                </label>
                <p className="text-gray-900">
                  {new Date(mess.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {new Date(mess.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
