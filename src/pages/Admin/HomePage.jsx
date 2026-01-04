import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { saveHomeSlides, fetchHomeSlides, clearHomeState } from "@/store/admin/homePageSlice";
import { toast } from "react-toastify";


export const HomePage = () => {
  const dispatch = useDispatch();
  const { isSaving, slides: storedSlides } = useSelector((state) => state.home);

  const [slides, setSlides] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  /* ---------------- FETCH SLIDES ---------------- */
  useEffect(() => {
    dispatch(fetchHomeSlides());
  }, [dispatch]);

  useEffect(() => {
    if (storedSlides?.length) {
      setSlides(
        storedSlides.map((slide) => ({
          title: slide.title,
          description: slide.description,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
          image: null,
          preview: slide.backgroundImage?.url || slide.preview,
        }))
      );
      setIsEditing(false); // ✅ hide form if data exists
    }
  }, [storedSlides]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  const handleImageUpload = (index, file) => {
    const updated = [...slides];
    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);
    setSlides(updated);
  };

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        image: null,
        preview: "",
      },
    ]);
    setIsEditing(true);
  };

  const removeSlide = (index) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    dispatch(saveHomeSlides(slides)).then((res) => {
      if (res.payload?.success) {
        toast.success("Home page slider updated");
        setIsEditing(false);
        dispatch(fetchHomeSlides()); // 🔁 reload preview
      } else {
        toast.error(res.payload?.message || "Failed to save");
      }
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Home Page Customization</h1>

      {/* ADD SLIDER BUTTON (ALWAYS VISIBLE) */}
      <Button onClick={addSlide} className="bg-[#13a4ec]">
        <Plus className="mr-2 h-4 w-4" />
        Add Slider
      </Button>

      {/* FORM + PREVIEW */}
      {(isEditing || slides.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT → FORM */}
          {isEditing && (
            <div className="space-y-6">
              {slides.map((slide, index) => (
                <Card key={index}>
                  <CardContent className="space-y-4 py-6">
                    <div className="flex justify-between">
                      <h2>Slide {index + 1}</h2>
                      {slides.length > 1 && (
                        <Trash2
                          className="cursor-pointer text-red-500"
                          onClick={() => removeSlide(index)}
                        />
                      )}
                    </div>

                    <Input
                      placeholder="Title"
                      value={slide.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
                      }
                      required={!slide.preview}
                    />

                    <Textarea
                      placeholder="Description"
                      value={slide.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      required={!slide.preview}
                    />

                    <Input
                      placeholder="Button Text"
                      value={slide.buttonText}
                      onChange={(e) =>
                        handleChange(index, "buttonText", e.target.value)
                      }
                      required={!slide.preview}
                    />

                    <Input
                      placeholder="Button Link"
                      value={slide.buttonLink}
                      onChange={(e) =>
                        handleChange(index, "buttonLink", e.target.value)
                      }
                      required={!slide.preview}
                    />

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(index, e.target.files[0])
                      }
                      required={!slide.preview}
                    />
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {/* RIGHT → LIVE PREVIEW */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Live Preview</h2>

            {slides.map((slide, index) => (
              <div
                key={index}
                className="relative h-[300px] flex items-center justify-center rounded-xl"
                style={{
                  backgroundImage: slide.preview
                    ? `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url(${slide.preview})`
                    : "linear-gradient(#000,#000)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="text-white text-center px-4">
                  <h2 className="text-2xl font-bold">{slide.title}</h2>
                  <p className="mb-4">{slide.description}</p>
                  <Button asChild variant="secondary">
                    <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

