import { Component, OnInit } from '@angular/core';
import { TexteService, TexteMap } from '../../vitrine/services/texte.service';

interface Champ {
  cle: string;
  label: string;
  defaut: string;
  multiline?: boolean;
}

interface Section {
  titre: string;
  champs: Champ[];
}

@Component({
  selector: 'app-textes',
  templateUrl: './textes.component.html',
  styleUrls: ['./textes.component.css']
})
export class TextesComponent implements OnInit {

  sections: Section[] = [
    {
      titre: 'Général',
      champs: [
        { cle: 'site.artiste.nom',  label: "Nom de l'artiste",             defaut: 'Pierre Darmstadter' },
        { cle: 'site.tagline',      label: 'Slogan du site (pied de page)', defaut: 'Peintures contemporaines — Paris' }
      ]
    },
    {
      titre: "Page d'accueil — Grande bannière",
      champs: [
        { cle: 'accueil.hero.eyebrow', label: 'Texte au-dessus du nom',    defaut: 'Peinture contemporaine · Paris' },
        { cle: 'accueil.hero.tagline', label: 'Citation',                   defaut: '« La lumière ne se montre jamais deux fois de la même façon. »' },
        { cle: 'accueil.hero.cta',     label: 'Texte du bouton principal',  defaut: 'Découvrir les œuvres' },
      ]
    },
    {
      titre: "Page d'accueil — Section galerie",
      champs: [
        { cle: 'accueil.galerie.titre', label: 'Titre de la section',           defaut: 'Dernières œuvres' },
        { cle: 'accueil.galerie.lien',  label: 'Lien vers la galerie complète', defaut: 'Voir toute la galerie →' }
      ]
    },
    {
      titre: "Page d'accueil — Section présentation",
      champs: [
        { cle: 'accueil.about.eyebrow', label: 'Petit titre au-dessus',       defaut: "L'artiste" },
        { cle: 'accueil.about.texte',   label: 'Texte de présentation',       defaut: "Peintre depuis plusieurs décennies, Pierre Darmstadter explore la lumière et la matière dans ses toiles. Son travail, ancré dans la tradition figurative, dialogue avec une sensibilité contemporaine.", multiline: true },
        { cle: 'accueil.about.cta',     label: 'Texte du bouton biographie',  defaut: 'Lire la biographie' }
      ]
    },
    {
      titre: 'Page Biographie',
      champs: [
        { cle: 'artiste.eyebrow',        label: 'Libellé de page',              defaut: 'Biographie' },
        { cle: 'artiste.photo.legende',  label: 'Légende de la photo',          defaut: 'Pierre Darmstadter, atelier' },
        { cle: 'artiste.intro',          label: "Texte d'introduction",         defaut: "Peintre français, Pierre Darmstadter vit et travaille à Paris. Son œuvre s'inscrit dans une recherche picturale sur la lumière, le temps et la présence des choses.", multiline: true },
        { cle: 'artiste.parcours.titre', label: 'Titre de la section parcours', defaut: 'Parcours' },
        { cle: 'artiste.parcours.p1',    label: 'Premier paragraphe',           defaut: "Pierre Darmstadter développe une œuvre singulière, ancrée dans la tradition de la peinture à l'huile mais traversée par une sensibilité contemporaine.", multiline: true },
        { cle: 'artiste.parcours.p2',    label: 'Deuxième paragraphe',          defaut: "Son travail interroge la lumière dans ses manifestations les plus fugaces : l'aurore sur l'eau, la pénombre d'un intérieur, le dernier éclat du jour avant la nuit.", multiline: true }
      ]
    },
    {
      titre: 'Page Galerie',
      champs: [
        { cle: 'galerie.titre',      label: 'Titre de la page', defaut: 'Galerie' },
        { cle: 'galerie.sous_titre', label: 'Sous-titre',        defaut: 'Œuvres de Pierre Darmstadter' }
      ]
    },
    {
      titre: 'Page Contact',
      champs: [
        { cle: 'contact.eyebrow',            label: 'Libellé de page',       defaut: 'Contact' },
        { cle: 'contact.titre',              label: 'Titre de la page',       defaut: 'Entrons en conversation' },
        { cle: 'contact.description',        label: "Texte d'introduction",   defaut: "Pour toute demande concernant une œuvre ou une exposition, Pierre Darmstadter vous répondra dans les meilleurs délais.", multiline: true },
        { cle: 'contact.email',              label: 'Adresse email affichée', defaut: 'pierre.darmstadter@gmail.com' },
        { cle: 'contact.atelier.lieu',       label: "Lieu de l'atelier",      defaut: 'Paris' },
        { cle: 'contact.atelier.horaires',   label: 'Horaires / accès',       defaut: 'Sur rendez-vous' }
      ]
    }
  ];

  valeurs: TexteMap = {};
  saving = false;
  toast: { message: string; error: boolean } | null = null;
  private toastTimer: any;

  // Photo upload
  photoFile: File | null = null;
  photoPreview: string | null = null;
  uploadingPhoto = false;

  constructor(private texteService: TexteService) {}

  ngOnInit(): void {
    this.sections.forEach(s =>
      s.champs.forEach(c => { this.valeurs[c.cle] = c.defaut; })
    );
    this.texteService.load().subscribe({
      next: (t) => {
        if (Object.keys(t).length > 0) {
          this.valeurs = { ...this.valeurs, ...t };
        }
      }
    });
  }

  saveSection(section: Section): void {
    const updates: TexteMap = {};
    section.champs.forEach(c => { updates[c.cle] = this.valeurs[c.cle] ?? c.defaut; });
    this.saving = true;
    this.texteService.saveAll(updates).subscribe({
      next: () => {
        this.saving = false;
        this.showToast('Modifications sauvegardées', false);
      },
      error: () => {
        this.saving = false;
        this.showToast('Erreur — modifications non sauvegardées', true);
      }
    });
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => { this.photoPreview = reader.result as string; };
      reader.readAsDataURL(this.photoFile);
    }
  }

  uploadPhoto(): void {
    if (!this.photoFile) return;
    this.uploadingPhoto = true;
    this.texteService.uploadPhoto(this.photoFile).subscribe({
      next: (res) => {
        this.uploadingPhoto = false;
        this.valeurs['site.artiste.photo'] = res.url;
        this.photoFile = null;
        this.photoPreview = null;
        this.showToast('Photo mise à jour', false);
      },
      error: () => {
        this.uploadingPhoto = false;
        this.showToast('Erreur lors de l\'envoi de la photo', true);
      }
    });
  }

  private showToast(message: string, error: boolean): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, error };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3000);
  }
}
