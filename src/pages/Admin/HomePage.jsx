import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import {
  deleteHomeSlide,
  fetchHomeSlide,
  saveHomeSlide,
} from "@/store/admin/homePageSlice";
import { Link } from "react-router";
import { Trash2, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "/mess/listing",
  image: null,
};

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    slide = [],
    isSaving,
    isLoading,
  } = useSelector((state) => state.home);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  /* ---------------- LOAD SLIDES ---------------- */
  useEffect(() => {
    dispatch(fetchHomeSlide());
  }, [dispatch]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSave = () => {
    if (!form.title || !form.description || !form.buttonText || !form.image) {
      toast.error("All fields including image are required");
      return;
    }

    dispatch(saveHomeSlide(form)).then((res) => {
      if (res.payload?.success) {
        toast.success("Banner added successfully");
        setForm(initialForm);
        setOpen(false);
        dispatch(fetchHomeSlide());
      } else {
        toast.error(res.payload?.message || "Failed to add banner");
      }
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteHomeSlide(id)).then((res) => {
      if (res.payload.success) {
        toast.success(res.payload?.message);
      } else {
        toast.error(res.payload?.message);
      }
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Home Page Banners</h1>

      {/* ADD SLIDE BUTTON */}
      <Button variant="nav" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Slide
      </Button>

      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
          </div>
      ) : (
        // slider
        <div className="space-y-6">
          {slide?.length > 0 ? (
            slide.map((s) => (
              <Card key={s._id}>
                <CardContent className="p-0">
                  <div
                    className="relative h-[350px] rounded-xl overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url(${s.backgroundImage.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="text-white text-center px-4">
                      <h2 className="text-3xl font-bold mb-2">{s.title}</h2>
                      <p className="mb-4">{s.description}</p>
                      <Button asChild variant="secondary">
                        <Link to={s.buttonLink}>{s.buttonText}</Link>
                      </Button>
                    </div>

                    {/* DELETE BUTTON */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4"
                      onClick={() => handleDelete(s._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No banner added yet.</p>
          )}
        </div>
      )}

      {/* ADD SLIDE MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Home Page Slide</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-3">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-3">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-3">Button Text</Label>
              <Input
                value={form.buttonText}
                onChange={(e) => handleChange("buttonText", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-3">Button Link</Label>
              <Input
                value={form.buttonLink}
                onChange={(e) => handleChange("buttonLink", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-3">Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="nav" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        newestOnTop
        theme="light"
      />
    </div>
  );
};

export default HomePage;
