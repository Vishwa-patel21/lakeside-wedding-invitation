"use client";

import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { weddingConfig } from "@/lib/config";

function getWhatsAppUrl() {
  const digits = weddingConfig.rsvp.phoneNumber.replace(/\D/g, "");
  const text = encodeURIComponent(weddingConfig.rsvp.whatsappMessage);
  return `https://wa.me/${digits}?text=${text}`;
}

function getPhoneUrl(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Countdown() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = useMemo(() => {
    if (!now) {
      return [
        { label: "Days", value: "--" },
        { label: "Hours", value: "--" },
        { label: "Minutes", value: "--" },
        { label: "Seconds", value: "--" }
      ];
    }

    const target = new Date(weddingConfig.date.iso).getTime();
    const diff = Math.max(0, target - now.getTime());
    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const minute = 1000 * 60;

    return [
      { label: "Days", value: Math.floor(diff / day) },
      { label: "Hours", value: Math.floor((diff % day) / hour) },
      { label: "Minutes", value: Math.floor((diff % hour) / minute) },
      { label: "Seconds", value: Math.floor((diff % minute) / 1000) }
    ];
  }, [now]);

  return (
    <div className="countdown" aria-label="Wedding countdown">
      {parts.map((part) => (
        <div className="countdownItem" key={part.label}>
          <strong>{typeof part.value === "number" ? String(part.value).padStart(2, "0") : part.value}</strong>
          <span>{part.label}</span>
        </div>
      ))}
    </div>
  );
}

function RsvpForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      attending: form.get("attending"),
      guests: Number(form.get("guests") || 1),
      message: form.get("message")
    };

    if (!isSupabaseConfigured) {
      setStatus("RSVP preview saved only after Supabase keys are added.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("rsvps").insert(payload);
    setIsSubmitting(false);

    if (error) {
      setStatus("Something went wrong. Please try WhatsApp instead.");
      return;
    }

    event.currentTarget.reset();
    setStatus("Thank you. Your RSVP has been received.");
  }

  return (
    <form className="rsvpForm" onSubmit={handleSubmit}>
      <label>
        Your name
        <input name="name" required placeholder="Full name" />
      </label>
      <label>
        Attending
        <select name="attending" required defaultValue="yes">
          <option value="yes">Yes, I will be there</option>
          <option value="no">Sorry, I cannot attend</option>
        </select>
      </label>
      <label>
        Guests
        <input name="guests" type="number" min="1" max="6" defaultValue="1" />
      </label>
      <label>
        Message
        <textarea name="message" rows="3" placeholder="Meal notes or a sweet message" />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send RSVP"}
      </button>
      {status ? <p className="formStatus">{status}</p> : null}
    </form>
  );
}

export default function HomePage() {
  const [opened, setOpened] = useState(false);

  return (
    <main>
      <section className={`hero ${opened ? "isOpen" : ""}`}>
        <div className="petals" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <button
          className="letterInvite"
          type="button"
          onClick={() => setOpened(true)}
          aria-label="Open wedding invitation"
        >
          <span className="letterFlap" />
          <span className="letterCard">
            <span className="letterSeal">{weddingConfig.couple.initials}</span>
            <span className="letterTitle">Wedding Invitation</span>
            <span className="letterHint">Tap to open</span>
          </span>
        </button>
        <div className="heroContent">
          <div className="arch" aria-hidden="true" />
          <p className="eyebrow">{weddingConfig.invitation.headline}</p>
          <h1>
            <span>{weddingConfig.couple.bride}</span>
            <em>&</em>
            <span>{weddingConfig.couple.groom}</span>
          </h1>
          <p className="heroMessage">{weddingConfig.invitation.message}</p>
          <div className="heroDetails">
            <span>{weddingConfig.date.display}</span>
            <span>{weddingConfig.date.time}</span>
            <span>{weddingConfig.venue.name}</span>
          </div>
          <div className="heroActions">
            <a href="#rsvp">RSVP Now</a>
            <a href="#couple">Couple Photos</a>
            <a href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
              View Map
            </a>
          </div>
        </div>
      </section>

      <section className="detailsBand">
        <div className="sectionInner threeColumns">
          <article>
            <span>Date</span>
            <strong>{weddingConfig.date.display}</strong>
          </article>
          <article>
            <span>Time</span>
            <strong>{weddingConfig.date.time}</strong>
          </article>
          <article>
            <span>Venue</span>
            <strong>{weddingConfig.venue.name}</strong>
            <small>{weddingConfig.venue.line1}</small>
          </article>
        </div>
      </section>

      <section className="sectionInner storySection">
        <div>
          <p className="eyebrow">By the lake</p>
          <h2>A golden lakeside celebration</h2>
        </div>
        <p>{weddingConfig.couple.story}</p>
      </section>

      <section className="galleryBand" id="couple">
        <div className="sectionInner">
          <div className="sectionHeader">
            <p className="eyebrow">Our moments</p>
            <h2>Couple Photos</h2>
          </div>
          <div className="photoStrip">
            {weddingConfig.couple.photos.map((photo, index) => (
              <figure key={photo.src} className={`couplePhoto photo${index + 1}`}>
                <img src={photo.src} alt={photo.alt} />
                <figcaption>
                  {index === 0 ? "Before the vows" : index === 1 ? "Together forever" : "By the water"}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="timelineBand">
        <div className="sectionInner">
          <p className="eyebrow">Wedding day</p>
          <h2>Celebration Timeline</h2>
          <div className="timeline">
            {weddingConfig.schedule.map((item) => (
              <article key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionInner countdownSection">
        <div>
          <p className="eyebrow">Almost time</p>
          <h2>Counting down to the celebration</h2>
        </div>
        <Countdown />
      </section>

      <section className="contactBand">
        <div className="sectionInner">
          <div className="sectionHeader">
            <p className="eyebrow">Need help?</p>
            <h2>Contact Information</h2>
          </div>
          <div className="contactGrid">
            {weddingConfig.contacts.map((contact) => (
              <article key={contact.role} className="contactCard">
                <span>{contact.role}</span>
                <strong>{contact.name}</strong>
                <p>{contact.note}</p>
                <div>
                  <a href={getPhoneUrl(contact.phone)}>Call</a>
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rsvpBand" id="rsvp">
        <div className="sectionInner rsvpGrid">
          <div>
            <p className="eyebrow">Kindly reply</p>
            <h2>RSVP by {weddingConfig.invitation.rsvpDeadline}</h2>
            <p>
              Send your response here, or use WhatsApp if that is easier. Guest
              photo uploads are available through the QR page after deployment.
            </p>
            <div className="rsvpLinks">
              <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
                RSVP on WhatsApp
              </a>
              <a href={weddingConfig.photos.uploadPath}>Guest Photo QR</a>
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      <footer>
        <strong>{weddingConfig.couple.initials}</strong>
        <span>Can&apos;t wait to celebrate with you by the lake.</span>
      </footer>
    </main>
  );
}
