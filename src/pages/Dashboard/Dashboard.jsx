import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  DollarSign,
  Shield,
} from "lucide-react";
import { Link } from "react-router";

const Dashboard = () => {
  const [location, setLocation] = useState("");

  const slides = [
    {
      title: "Find Your Perfect Mess Accommodation",
      description:
        "Discover a wide range of mess options tailored to your needs and preferences. Enjoy delicious, home-style meals and a comfortable living experience.",
      buttonText: "View Listing",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAa0STPioNBnB-IF2ejnC5iFgyaka-fpn-JMNLRGp8xlhUCANZIF-gJKRkS25pF9Ntf9zXwdVFQIShs2hPl9Jsf81_gwQyERaUR2Zmr3XCcBERqXPUWmKQL9c_3BxYiKMMZHAzflyOT9AAl7-DYusm-OA_OmDsBI4P3_KxVKxnrlzqZ3Z1hrQ55S865OPmR6IOKh_eB50dxrrnMAWlCAyQB-mI3FqV05MaS0pBVjgD3vwrpj-0Z4uw6P6cLweOINFE-WX0NmeBDXKc",
    },
    {
      title: "Modern Kitchens, Healthy Meals",
      description:
        "Our featured messes come with state-of-the-art kitchens ensuring hygienic and delicious food every day.",
      buttonText: "Explore Now",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnvkl8EZ9R4UQopb1eEvivyKud4M4xP1Pm-geQOOnbq64vfH7k46F7QJGCcPNWA4I0p60ulVg628tQB2Xexnnb4ncvIsMBU0dRhHWBxXdomk8mvZY27mnk1xJgo6Zz9tHnkPQTDeCmBezWUCFCzWxqbjh3kMGUlb6oGt-o-cM7-R_6HVK4gQT6QlAvRx9Kjn1-upV7YDDafUCK4wHa64csgnyglNaeRt6wngay5Chk3z4z-poYpP8DsQ669sqhpkkJDCgf2RE8ZxU",
    },
    {
      title: "Vibrant Community Dining",
      description:
        "Connect with fellow students and build friendships in a lively and welcoming dining atmosphere.",
      buttonText: "Join the Community",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAaQM7CMzJXAFt6OpBMBlAf1EqOgLH8Ay4USfd-8loB6PSuSo2MJ_lsUFCMnwSPuwddRWSr-zqf-ODfLX5Za3P86JcRer7QhOD2j-3z5wI4tvN-KPocqO3MY5QjuKcVb6PguGmGTvSKQ630bgwGl3AZVx2Mki4zGfVdseZs1RrsL40Agy6A46mDYAXZ6S_kFUqx9T8r6Op598faLsOPo2ohFfKt410av7bBGp6OP5EIsvyrNPxQVigZuLaeen5tlkvwNgH1gdzKPws",
    },
  ];

  const featuredMessListings = [
    {
      title: "Cozy Home Mess",
      description:
        "Experience the warmth of home-cooked meals in a friendly environment.",
      price: "৳4,500/month",
      rating: 4.8,
      reviews: 124,
      location: "Dhanmondi, Dhaka",
      amenities: ["WiFi", "AC", "Laundry", "Parking"],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnvkl8EZ9R4UQopb1eEvivyKud4M4xP1Pm-geQOOnbq64vfH7k46F7QJGCcPNWA4I0p60ulVg628tQB2Xexnnb4ncvIsMBU0dRhHWBxXdomk8mvZY27mnk1xJgo6Zz9tHnkPQTDeCmBezWUCFCzWxqbjh3kMGUlb6oGt-o-cM7-R_6HVK4gQT6QlAvRx9Kjn1-upV7YDDafUCK4wHa64csgnyglNaeRt6wngay5Chk3z4z-poYpP8DsQ669sqhpkkJDCgf2RE8ZxU",
    },
    {
      title: "Modern Kitchen Mess",
      description:
        "Enjoy meals prepared in a state-of-the-art kitchen with a focus on hygiene.",
      price: "৳5,200/month",
      rating: 4.9,
      reviews: 89,
      location: "Gulshan, Dhaka",
      amenities: ["WiFi", "AC", "Gym", "24/7 Security"],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAaQM7CMzJXAFt6OpBMBlAf1EqOgLH8Ay4USfd-8loB6PSuSo2MJ_lsUFCMnwSPuwddRWSr-zqf-ODfLX5Za3P86JcRer7QhOD2j-3z5wI4tvN-KPocqO3MY5QjuKcVb6PguGmGTvSKQ630bgwGl3AZVx2Mki4zGfVdseZs1RrsL40Agy6A46mDYAXZ6S_kFUqx9T8r6Op598faLsOPo2ohFfKt410av7bBGp6OP5EIsvyrNPxQVigZuLaeen5tlkvwNgH1gdzKPws",
    },
    {
      title: "Community Dining Mess",
      description:
        "Connect with fellow students over delicious meals in a vibrant setting.",
      price: "৳3,800/month",
      rating: 4.7,
      reviews: 156,
      location: "Uttara, Dhaka",
      amenities: ["WiFi", "Study Room", "TV Lounge", "Games"],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPScL1eNMJ7h3zVBgZ8aD_I8SJ_DfIp9RWO3RlVD8CmUxM6ySzmFVdBGgRj4rWDtgi8gRQ3xbYrUwZLN1DFrG_WVPdqvsSQ9eskYRChuHwcy9_6Hj1lDqDpIRb0L64766EIcpmCl290JiE9-ObmO9dtG-3iuVP1J9E5eG80ePaxgX6RcVnu3jk3jhnrBnM9EXoNMgJBw9dldk4nv8IFyTg04UXOq9MYRv1XPLQ6BmK-E0ZJCxcrXbwfryN8vr3ucwZ0yEYxwfGdDM",
    },
    {
      title: "Premium Student Hostel",
      description:
        "Luxurious accommodation with premium facilities and healthy meals.",
      price: "৳6,500/month",
      rating: 4.9,
      reviews: 67,
      location: "Bashundhara, Dhaka",
      amenities: ["WiFi", "AC", "Gym", "Swimming Pool"],
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

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
      value: "2,500+",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Searching mess near: ${location}`);
    setLocation("");
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-40 flex flex-col justify-center py-3 sm:py-4 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden rounded-2xl">
        <Carousel className="w-full rounded-2xl">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div
                  className="relative h-[500px] md:h-[600px] flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${slide.backgroundImage}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="container mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in duration-500">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-in fade-in duration-700">
                      {slide.description}
                    </p>
                    <Button
                    variant="nav"
                      size="lg"
                      className="animate-in fade-in duration-500 border-0"
                    >
                      {slide.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
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
            <Link to="/mess/listing" className="flex">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMessListings.map((mess, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={mess.image}
                  alt={mess.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-white text-black hover:bg-white">
                  <Star className="mr-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {mess.rating} ({mess.reviews})
                </Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{mess.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1 h-4 w-4" />
                      {mess.location}
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {mess.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {mess.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mess.amenities.map((amenity, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button variant="nav" className="w-full mt-auto">
                  View Details
                </Button>
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

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied
            students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-8">
                <div className="absolute -top-4 left-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {["A", "B", "C"][index]}
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Found the perfect mess within my budget. The food quality and
                  living conditions exceeded my expectations!"
                </p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold">Mohammad Rahman</p>
                    <p className="text-sm text-muted-foreground">
                      University of Dhaka
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <Button size="lg" variant="secondary" className="text-blue-600">
              Browse Listings
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Users className="mr-2 h-5 w-5" />
              Register as Owner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
