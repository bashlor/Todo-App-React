
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Zap, Shield, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="py-4 px-6 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Se connecter</Button>
            </Link>
            <Link to="/signup">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Organisez votre travail, simplifiez votre vie
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          TaskFlow est la plateforme de gestion de tâches qui vous aide à rester organisé, productif et concentré sur ce qui compte vraiment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              Commencer gratuitement <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Se connecter
            </Button>
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">Fonctionnalités principales</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border animate-fade-in">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestion simple des tâches</h3>
              <p className="text-muted-foreground">
                Créez, organisez et suivez vos tâches avec une interface intuitive conçue pour la productivité.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border animate-fade-in [animation-delay:200ms]">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Catégories personnalisées</h3>
              <p className="text-muted-foreground">
                Organisez vos tâches par catégories pour mieux structurer votre travail et gagner en clarté.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border animate-fade-in [animation-delay:400ms]">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche intelligente</h3>
              <p className="text-muted-foreground">
                Retrouvez rapidement n'importe quelle tâche avec notre système de recherche et de filtrage avancé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="container py-20">
        <div className="bg-accent rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à booster votre productivité ?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Rejoignez des milliers d'utilisateurs qui transforment leur façon de travailler avec TaskFlow.
          </p>
          <Link to="/signup">
            <Button size="lg">Commencer gratuitement</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-10 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <h2 className="text-xl font-bold">TaskFlow</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskFlow. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
