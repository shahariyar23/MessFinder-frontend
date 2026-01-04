import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Search,
  Home,
  Users,
  Star,
  MapPin,
  CheckCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { getHomeMesses } from "@/store/mess/messSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeSlide } from "@/store/admin/homePageSlice";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const { homeMesses, totalMessListing, isHomeMessesLoading } = useSelector(
    (state) => state.mess
  );
  const { slide = [], isLoading } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (homeMesses.length === 0 && !isHomeMessesLoading) {
      dispatch(getHomeMesses({ limit: 4 }));
    }

    if (slide.length === 0 && !isLoading) {
      dispatch(fetchHomeSlide());
    }
  }, [
    dispatch,
    homeMesses.length,
    slide.length,
    isHomeMessesLoading,
    isLoading,
  ]);

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Extensive Listings",
      description:
        "Browse through a wide selection of mess options across various locations.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quality Assurance",
      description:
        "We carefully vet each listing to ensure quality and reliability.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Reviews",
      description:
        "Read reviews from other students to make informed decisions.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Verified Owners",
      description:
        "All mess owners are verified for authenticity and trustworthiness.",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const stats = [
    {
      label: "Total Listings",
      value: totalMessListing,
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Happy Students",
      value: "10,000+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Cities Covered",
      value: "25+",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: "Avg. Rating",
      value: "4.8/5",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const formatPrice = (price) => {
    return `৳${price}/month`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Searching mess near: ${location}`);
    setLocation("");
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-40 flex flex-col justify-center py-3 sm:py-4 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Carousel */}
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <section className="relative overflow-hidden rounded-2xl">
          <Carousel
            className="w-full rounded-2xl"
            plugins={[
              Autoplay({
                delay: 4000, // ⏱ 4 seconds
                stopOnInteraction: false, // keeps autoplay after click
                stopOnMouseEnter: true, // pause on hover
              }),
            ]}
          >
            <CarouselContent>
              {slide.length > 0 &&
                slide.map((s, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="relative h-[500px] md:h-[600px] flex items-center justify-center"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${s.backgroundImage?.url}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="container mx-auto px-4 text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in duration-500">
                          {s.title}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-in fade-in duration-700">
                          {s.description}
                        </p>
                        <Button
                          variant="nav"
                          size="lg"
                          className="animate-in fade-in duration-500 border-0"
                          asChild
                        >
                          <Link to={s.buttonLink}>
                            {s.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </section>
      )}

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Mess Listings</h2>
            <p className="text-muted-foreground">
              Handpicked accommodations for the best experience
            </p>
          </div>
          <Button variant="outline">
            <Link to="/mess/listing" className="flex">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeMesses.map((mess) => (
            <Card
              key={mess._id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/mess/info/${mess._id}`)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={mess.image?.[0]?.url || "/default-mess.jpg"}
                  alt={mess.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/default-mess.jpg";
                  }}
                />
                <Badge
                  variant="secondary"
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-black hover:bg-white"
                >
                  {formatPrice(mess.payPerMonth)}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">
                      {mess.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span className="line-clamp-1">{mess.address}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                  {mess.description}
                </p>

                {/* Mess Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Room Type</p>
                    <p className="font-medium capitalize">
                      {mess.roomType || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="font-medium capitalize">
                      {mess.genderPreference || "Any"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Available From</p>
                    <p className="font-medium">
                      {mess.availableFrom
                        ? new Date(mess.availableFrom).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Facilities */}
                {mess.facilities && mess.facilities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-1">
                      {mess.facilities.slice(0, 3).map((facility, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-gray-50"
                        >
                          {facility}
                        </Badge>
                      ))}
                      {mess.facilities.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-50 text-gray-500"
                        >
                          +{mess.facilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose MessFinder?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We simplify the process of finding the perfect mess accommodation,
              ensuring a comfortable and convenient experience for students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-8">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${feature.color} mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 rounded-2xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Mess?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who found their ideal accommodation
            through MessFinder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-blue-600"
              asChild
            >
              <Link to="/mess/listing">Browse Listings</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Users className="mr-2 h-5 w-5" />
              <Link to="/signup">Register as Owner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
