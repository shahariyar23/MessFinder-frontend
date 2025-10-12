import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

export const StarRating = ({ rating, handelratingChange }) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:text-primary-foreground hover:bg-black"
      }`}
      variant="outline"
      size="icon"
      onClick={handelratingChange ? () => handelratingChange(star) : null}
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </Button>
  ));
};
