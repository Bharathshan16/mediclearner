import React from "react";
import { User, Building, MessageCircle, Mail } from "lucide-react";
import Layout from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  // Mock user data - in a real app, this would come from authentication/user profile
  const users = [
    {
      name: "Bharath Shanmugavel",
      role: "System Engineer",
      email: "bharath_shanmugavel@epam.com",
      bio: "Jr. System Engineer",
      joinedDate: "April 2026",
    },
    {
      name: "Madhusmita Jena",
      role: "System Engineer",
      email: "madhusmita_jena@epam.com",
      bio: "Jr. System Engineer",
      joinedDate: "April 2026",
    },
  ];

  return (
    <Layout>
      <section className="mb-16 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-50 text-medical-600 rounded-full text-sm font-medium">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            MediPredict
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced AI solutions for healthcare professionals
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-slide-up">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-medical-600" />
              About Our Platform
            </CardTitle>
            <CardDescription>Learn about our mission and technology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              MediPredict is an innovative healthcare platform leveraging advanced machine learning 
              algorithms to provide accurate medical predictions and risk assessments.
            </p>
            <p>
              Our platform utilizes state-of-the-art models trained on diverse medical datasets to 
              help healthcare professionals identify potential health risks early and make 
              informed decisions.
            </p>
            <p>
              All our prediction services are powered by Microsoft Azure and AWS machine learning 
              capabilities, ensuring reliable, secure, and scalable performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-medical-600" />
              User Profiles
            </CardTitle>
            <CardDescription>Meet the team behind MediPredict</CardDescription>
          </CardHeader>
          <CardContent>
            {users.map((user, index) => (
              <div key={index} className="mb-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.role}</p>
                <p className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4 text-medical-600" />
                  {user.email}
                </p>
                <p className="text-sm mt-2">{user.bio}</p>
                <p className="text-xs text-muted-foreground mt-2">Member Since: {user.joinedDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <section className="mb-16 animate-slide-up">
        <h2 className="text-2xl font-semibold mb-6">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data-Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We use extensive medical datasets to train our models, ensuring high accuracy and reliability.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy-Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All user data is encrypted and protected with industry-standard security measures.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Constantly Improving</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our models are continuously trained and updated with the latest medical research.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="animate-slide-up">
        <Card className="bg-gradient-to-r from-medical-50 to-blue-50 border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-medical-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Have questions or suggestions? Reach out to our team at 
              <a href="mailto:bharath_shanmugavel@epam.com" className="text-medical-600 ml-1 hover:underline">
                Bharath
              </a>
              {" "}or{" "}
              <a href="mailto:madhusmita_jena@epam.com" className="text-medical-600 ml-1 hover:underline">
                Madhusmita
              </a>.
            </p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default About;
