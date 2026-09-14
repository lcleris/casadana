package email

import (
	"fmt"
	"strings"
)

// catalog holds every string that appears in an email, per locale. Values with
// %s placeholders are documented at their use site in booking.go; the argument
// order is part of the key's contract and must match across locales.
//
// catalog_test.go asserts every locale carries the exact same key set, so a
// half-translated email can't ship.
var catalog = map[Locale]map[string]string{
	LocaleFR: {
		"brand.tagline":  "Deux lieux, une seule promesse : vous faire vivre des vacances inoubliables",
		"footer.signed":  "Delphine & Christophe",
		"footer.role":    "Vos hôtes",
		"footer.reply":   "Vous pouvez répondre directement à cet e-mail.",
		"label.villa":    "Logement",
		"label.checkin":  "Arrivée",
		"label.checkout": "Départ",
		"label.nights":   "Nuits",
		"label.guests":   "Voyageurs",
		"label.name":     "Nom",
		"label.email":    "E-mail",
		"label.phone":    "Téléphone",
		"label.message":  "Message",
		"label.ref":      "Référence",

		// Appended to the date in guest mail only, so a guest never has to hunt
		// for the arrival window in a separate message.
		"window.checkin":  "entre 16h et 22h",
		"window.checkout": "avant 11h",

		"greeting":           "Bonjour %s,",
		"guests.adult.one":   "%d adulte",
		"guests.adult.other": "%d adultes",
		"guests.child.one":   "%d enfant",
		"guests.child.other": "%d enfants",

		// %s = villa name
		"received.subject": "Votre demande de séjour — %s",
		"received.heading": "Demande reçue",
		"received.p1":      "Merci pour votre demande de séjour à %s 🌿",
		"received.p2":      "Nous avons bien reçu votre demande pour les dates suivantes :",
		"received.p3":      "À ce stade, votre réservation n'est pas encore confirmée. Nous allons vérifier les disponibilités et reviendrons vers vous très prochainement afin de vous transmettre les informations nécessaires et de finaliser ensemble votre réservation.",
		"received.p4":      "Si vous souhaitez déjà nous préciser quelque chose concernant votre séjour, n'hésitez pas à répondre directement à cet e-mail.",
		"received.note":    "Aucun montant ne vous est débité à ce stade. Au plaisir de vous accueillir prochainement sous le soleil de la Costa Cálida ☀️",

		// An approval opens the contract stage: it asks for the traveller details
		// Spanish law requires, and says plainly that the dates are only held once
		// the deposit lands.
		"approved.subject": "Votre demande pour %s a été acceptée",
		"approved.heading": "Demande acceptée",
		// %s = villa name, %s = check-in, %s = check-out
		"approved.p1": "Bonne nouvelle : votre demande de séjour à %s du %s au %s a bien été acceptée. 🌴☀️",
		"approved.p2": "Afin de préparer votre contrat de réservation, pourriez-vous répondre directement à cet e-mail en nous communiquant les informations suivantes :",
		// Items are pipe-separated: the catalog stays a flat map[string]string, so
		// the same key-set and placeholder checks cover these lines too.
		"approved.list.booker.title": "Pour la personne ayant réservé",
		"approved.list.booker.items": "Nom et prénom|Adresse postale|Adresse e-mail|Numéro de téléphone|Date de naissance",
		"approved.list.guests.title": "Pour les personnes qui vous accompagnent",
		"approved.list.guests.items": "Nom et prénom de chaque voyageur",
		"approved.p3":                "Nous savons que cela représente plusieurs informations à transmettre, mais certaines données concernant les voyageurs doivent être recueillies afin de respecter les obligations légales en Espagne.",
		"approved.p4":                "Dès réception de ces informations, vous recevrez votre contrat de réservation dans les 24 heures, accompagné des modalités de paiement de l'acompte.",
		"approved.p5":                "Vos dates seront définitivement bloquées dès réception de l'acompte prévu dans le contrat.",
		"approved.p6":                "Merci beaucoup pour votre collaboration. 😊",
		"approved.note":              "Au plaisir de vous accueillir très bientôt !",

		"rejected.subject": "Votre demande pour %s",
		"rejected.heading": "Demande non retenue",
		"rejected.p1":      "Merci pour l'intérêt que vous portez à %s.",
		// %s = check-in, %s = check-out
		"rejected.p2": "Malheureusement, nous ne pouvons pas confirmer votre demande pour les dates du %s au %s.",
		// %s = the other villa, named so the guest can picture it; the .nosibling
		// variant is what ships if there is ever only one property left.
		"rejected.p3":           "N'hésitez pas à nous répondre directement à cet e-mail : d'autres dates sont peut-être encore disponibles, et notre second logement, %s, peut également être libre sur cette période.",
		"rejected.p3.nosibling": "N'hésitez pas à nous répondre directement à cet e-mail : d'autres dates sont peut-être encore disponibles.",
		"rejected.p4":           "Nous regarderons avec plaisir les possibilités avec vous. 🌴",

		"cancelled.subject": "Votre réservation à %s a été annulée",
		"cancelled.heading": "Réservation annulée",
		"cancelled.p1":      "Votre réservation à %s du %s au %s a été annulée.",
		"cancelled.p2":      "S'il s'agit d'une erreur, répondez à cet e-mail : nous la rétablirons si les dates sont encore libres.",

		// %s = villa name, %s = check-in, %s = check-out
		"owner.subject":   "Nouvelle demande — %s · %s → %s",
		"owner.heading":   "Nouvelle demande de réservation",
		"owner.p1":        "Une nouvelle demande vient d'arriver depuis le site. Elle est en attente de votre réponse dans le back-office.",
		"owner.p2":        "Répondez à cet e-mail pour écrire directement au voyageur.",
		"owner.nomessage": "(aucun message)",

		"label.author": "Auteur",
		"label.rating": "Note",
		"label.review": "Avis",
		"label.source": "Provenance",

		// %s = villa name, %d = rating out of 5
		"review.owner.subject": "Nouvel avis — %s · %d/5",
		"review.owner.heading": "Nouvel avis à modérer",
		// %s = villa name
		"review.owner.p1":     "Un nouvel avis vient d'être déposé sur %s. Il n'est pas encore visible sur le site : il attend votre modération dans le back-office.",
		"review.owner.p2":     "Approuvez-le pour qu'il apparaisse sur la page du logement et compte dans la note publiée.",
		"review.owner.footer": "Approuvez ou refusez cet avis depuis le back-office.",
		"review.owner.nobody": "(aucun commentaire)",

		"review.source.website": "Formulaire du site",
		"review.source.direct":  "Depuis une réservation",
	},
	LocaleEN: {
		"brand.tagline":  "Two places, one promise: holidays you will never forget",
		"footer.signed":  "Delphine & Christophe",
		"footer.role":    "Your hosts",
		"footer.reply":   "You can reply directly to this email.",
		"label.villa":    "Property",
		"label.checkin":  "Check-in",
		"label.checkout": "Check-out",
		"label.nights":   "Nights",
		"label.guests":   "Guests",
		"label.name":     "Name",
		"label.email":    "Email",
		"label.phone":    "Phone",
		"label.message":  "Message",
		"label.ref":      "Reference",

		"window.checkin":  "between 4pm and 10pm",
		"window.checkout": "before 11am",

		"greeting":           "Hello %s,",
		"guests.adult.one":   "%d adult",
		"guests.adult.other": "%d adults",
		"guests.child.one":   "%d child",
		"guests.child.other": "%d children",

		"received.subject": "Your stay request — %s",
		"received.heading": "Request received",
		"received.p1":      "Thank you for your request to stay at %s 🌿",
		"received.p2":      "We have received your request for the following dates:",
		"received.p3":      "At this stage your booking is not confirmed yet. We will check availability and come back to you very shortly with everything you need, so we can finalise your booking together.",
		"received.p4":      "If there is already something you would like to tell us about your stay, simply reply to this email.",
		"received.note":    "Nothing is charged at this stage. We look forward to welcoming you under the Costa Cálida sun ☀️",

		"approved.subject": "Your request for %s has been accepted",
		"approved.heading": "Request accepted",
		"approved.p1":      "Good news: your request to stay at %s from %s to %s has been accepted. 🌴☀️",
		"approved.p2":      "So that we can prepare your booking contract, could you reply directly to this email with the following details:",

		"approved.list.booker.title": "For the person who made the booking",
		"approved.list.booker.items": "First and last name|Postal address|Email address|Phone number|Date of birth",
		"approved.list.guests.title": "For everyone travelling with you",
		"approved.list.guests.items": "First and last name of each guest",
		"approved.p3":                "We know that is a fair amount to send over, but some traveller details have to be collected to meet legal requirements in Spain.",
		"approved.p4":                "As soon as we have them, you will receive your booking contract within 24 hours, together with how to pay the deposit.",
		"approved.p5":                "Your dates are held for good once the deposit set out in the contract reaches us.",
		"approved.p6":                "Thank you very much for your help. 😊",
		"approved.note":              "We look forward to welcoming you very soon!",

		"rejected.subject":      "Your request for %s",
		"rejected.heading":      "Request not accepted",
		"rejected.p1":           "Thank you for your interest in %s.",
		"rejected.p2":           "Unfortunately we cannot confirm your request for the dates of %s to %s.",
		"rejected.p3":           "Do reply directly to this email: other dates may still be available, and our second property, %s, may also be free over that period.",
		"rejected.p3.nosibling": "Do reply directly to this email: other dates may still be available.",
		"rejected.p4":           "We would be glad to look at the options with you. 🌴",

		"cancelled.subject": "Your booking at %s has been cancelled",
		"cancelled.heading": "Booking cancelled",
		"cancelled.p1":      "Your booking at %s from %s to %s has been cancelled.",
		"cancelled.p2":      "If that's a mistake, reply to this email: we'll reinstate it if the dates are still free.",

		"owner.subject":   "New request — %s · %s → %s",
		"owner.heading":   "New booking request",
		"owner.p1":        "A new request just came in from the website. It's waiting for your answer in the back-office.",
		"owner.p2":        "Reply to this email to write to the guest directly.",
		"owner.nomessage": "(no message)",

		"label.author": "Author",
		"label.rating": "Rating",
		"label.review": "Review",
		"label.source": "Source",

		"review.owner.subject": "New review — %s · %d/5",
		"review.owner.heading": "New review to moderate",
		"review.owner.p1":      "A new review has just been left for %s. It isn't visible on the site yet: it's waiting for your moderation in the back-office.",
		"review.owner.p2":      "Approve it for it to appear on the property page and count towards the published rating.",
		"review.owner.footer":  "Approve or reject this review from the back-office.",
		"review.owner.nobody":  "(no comment)",

		"review.source.website": "Website form",
		"review.source.direct":  "From a booking",
	},
	LocaleES: {
		"brand.tagline":  "Dos lugares, una sola promesa: unas vacaciones inolvidables",
		"footer.signed":  "Delphine & Christophe",
		"footer.role":    "Sus anfitriones",
		"footer.reply":   "Puede responder directamente a este correo.",
		"label.villa":    "Alojamiento",
		"label.checkin":  "Llegada",
		"label.checkout": "Salida",
		"label.nights":   "Noches",
		"label.guests":   "Huéspedes",
		"label.name":     "Nombre",
		"label.email":    "Correo",
		"label.phone":    "Teléfono",
		"label.message":  "Mensaje",
		"label.ref":      "Referencia",

		"window.checkin":  "entre las 16:00 y las 22:00",
		"window.checkout": "antes de las 11:00",

		"greeting":           "Hola %s:",
		"guests.adult.one":   "%d adulto",
		"guests.adult.other": "%d adultos",
		"guests.child.one":   "%d niño",
		"guests.child.other": "%d niños",

		"received.subject": "Su solicitud de estancia — %s",
		"received.heading": "Solicitud recibida",
		"received.p1":      "Gracias por su solicitud de estancia en %s 🌿",
		"received.p2":      "Hemos recibido su solicitud para las fechas siguientes:",
		"received.p3":      "Por el momento su reserva todavía no está confirmada. Vamos a comprobar la disponibilidad y le responderemos muy pronto con toda la información necesaria para finalizar juntos su reserva.",
		"received.p4":      "Si desea indicarnos algo sobre su estancia, no dude en responder directamente a este correo.",
		"received.note":    "No se le cobra ningún importe en esta fase. Esperamos recibirle pronto bajo el sol de la Costa Cálida ☀️",

		"approved.subject": "Su solicitud para %s ha sido aceptada",
		"approved.heading": "Solicitud aceptada",
		"approved.p1":      "Buenas noticias: su solicitud de estancia en %s del %s al %s ha sido aceptada. 🌴☀️",
		"approved.p2":      "Para preparar su contrato de reserva, ¿podría responder directamente a este correo indicándonos los siguientes datos?",

		"approved.list.booker.title": "De la persona que ha reservado",
		"approved.list.booker.items": "Nombre y apellidos|Dirección postal|Correo electrónico|Número de teléfono|Fecha de nacimiento",
		"approved.list.guests.title": "De las personas que le acompañan",
		"approved.list.guests.items": "Nombre y apellidos de cada viajero",
		"approved.p3":                "Sabemos que son varios datos, pero cierta información sobre los viajeros debe recogerse para cumplir con las obligaciones legales en España.",
		"approved.p4":                "En cuanto los recibamos, le enviaremos su contrato de reserva en un plazo de 24 horas, junto con las condiciones de pago de la señal.",
		"approved.p5":                "Sus fechas quedarán bloqueadas definitivamente en cuanto recibamos la señal prevista en el contrato.",
		"approved.p6":                "Muchas gracias por su colaboración. 😊",
		"approved.note":              "¡Esperamos recibirle muy pronto!",

		"rejected.subject":      "Su solicitud para %s",
		"rejected.heading":      "Solicitud no aceptada",
		"rejected.p1":           "Gracias por el interés que muestra por %s.",
		"rejected.p2":           "Lamentablemente no podemos confirmar su solicitud para las fechas del %s al %s.",
		"rejected.p3":           "No dude en responder directamente a este correo: puede que otras fechas sigan disponibles y que nuestro segundo alojamiento, %s, también esté libre en ese periodo.",
		"rejected.p3.nosibling": "No dude en responder directamente a este correo: puede que otras fechas sigan disponibles.",
		"rejected.p4":           "Estaremos encantados de estudiar las posibilidades con usted. 🌴",

		"cancelled.subject": "Su reserva en %s ha sido cancelada",
		"cancelled.heading": "Reserva cancelada",
		"cancelled.p1":      "Su reserva en %s del %s al %s ha sido cancelada.",
		"cancelled.p2":      "Si se trata de un error, responda a este correo: la restableceremos si las fechas siguen libres.",

		"owner.subject":   "Nueva solicitud — %s · %s → %s",
		"owner.heading":   "Nueva solicitud de reserva",
		"owner.p1":        "Acaba de llegar una nueva solicitud desde el sitio web. Está esperando su respuesta en el back-office.",
		"owner.p2":        "Responda a este correo para escribir directamente al huésped.",
		"owner.nomessage": "(sin mensaje)",

		"label.author": "Autor",
		"label.rating": "Valoración",
		"label.review": "Opinión",
		"label.source": "Procedencia",

		"review.owner.subject": "Nueva opinión — %s · %d/5",
		"review.owner.heading": "Nueva opinión por moderar",
		"review.owner.p1":      "Acaba de llegar una nueva opinión sobre %s. Todavía no es visible en el sitio: está esperando su moderación en el back-office.",
		"review.owner.p2":      "Apruébela para que aparezca en la página del alojamiento y cuente en la valoración publicada.",
		"review.owner.footer":  "Apruebe o rechace esta opinión desde el back-office.",
		"review.owner.nobody":  "(sin comentario)",

		"review.source.website": "Formulario del sitio",
		"review.source.direct":  "Desde una reserva",
	},
}

// t resolves a catalog key, falling back to the default locale rather than
// rendering an empty string into an email a guest will read.
func t(loc Locale, key string) string {
	if s, ok := catalog[loc][key]; ok {
		return s
	}
	return catalog[DefaultLocale][key]
}

func tf(loc Locale, key string, args ...any) string {
	return fmt.Sprintf(t(loc, key), args...)
}

// plural picks between "<prefix>.one" and "<prefix>.other". The three locales
// this site ships all split at exactly one, so a full CLDR plural-rules
// implementation would be dead weight.
func plural(loc Locale, prefix string, n int) string {
	suffix := ".other"
	if n == 1 {
		suffix = ".one"
	}
	return tf(loc, prefix+suffix, n)
}

// tlist resolves a key whose value is a pipe-separated list of bullet points.
// Storing lists this way keeps the catalog one flat map, so the key-set and
// placeholder checks in catalog_test.go cover bulleted copy too.
func tlist(loc Locale, key string) []string {
	raw := t(loc, key)
	if raw == "" {
		return nil
	}
	parts := strings.Split(raw, "|")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if p = strings.TrimSpace(p); p != "" {
			out = append(out, p)
		}
	}
	return out
}
