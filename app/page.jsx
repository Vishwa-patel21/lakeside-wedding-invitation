"use client";

import { useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { weddingConfig } from "@/lib/config";

function Icon({ name }) {
  const paths = {
    calendar: "M7 2v3M17 2v3M3.5 9h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
    map: "M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    heart: "M12 21s-7.5-4.5-9.4-9.1C.9 7.8 3.2 4 7 4c2 0 3.4 1 5 2.8C13.6 5 15 4 17 4c3.8 0 6.1 3.8 4.4 7.9C19.5 16.5 12 21 12 21Z"
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function RsvpForm() {
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get("name"),
      attending: form.get("attending"),
      guests: Number(form.get("guests") || 1),
      message: form.get("message")
    };

    setStatus({ type: "notice", text: "Saving your RSVP..." });

    if (!isSupabaseConfigured) {
      setStatus({
        type: "notice",
        text: "RSVP preview only. Add Supabase keys to save responses."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("rsvps").insert(payload);

      if (error) {
        setStatus({
          type: "error",
          text: `RSVP could not be saved: ${error.message}`
        });
        return;
      }

      formElement.reset();
      setStatus({
        type: "success",
        text: "Your response has been saved. Thank you for celebrating with us."
      });
    } catch {
      setStatus({
        type: "error",
        text: "RSVP could not be saved. Please check the internet connection and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rsvpForm simpleRsvpForm" onSubmit={handleSubmit}>
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
        <textarea name="message" rows="3" placeholder="Optional message" />
      </label>
      {status ? (
        <p className={`formStatus ${status.type}`} role="status" aria-live="polite">
          {status.text}
        </p>
      ) : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send RSVP"}
      </button>
      {status?.type === "success" ? (
        <div className="successToast" role="status" aria-live="polite">
          {status.text}
        </div>
      ) : null}
    </form>
  );
}

export default function HomePage() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="simplePage">
      <section className={`hero simpleHero ${opened ? "isOpen" : ""}`}>
        <div className="petals" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="curtain curtainLeft" aria-hidden="true" />
        <div className="curtain curtainRight" aria-hidden="true" />
        <button className="letterOpener" type="button" onClick={() => setOpened(true)}>
          <span className="letterFold letterFoldTop" />
          <span className="letterFold letterFoldBottom" />
          <span className="heartStamp">
            <Icon name="heart" />
          </span>
          <span className="letterOpenText">Touch the heart to open</span>
        </button>

        <div className="heroContent simpleHeroContent">
          <p className="eyebrow">{weddingConfig.invitation.headline}</p>
          <h1>
            <span>{weddingConfig.couple.bride}</span>
            <em>&</em>
            <span>{weddingConfig.couple.groom}</span>
          </h1>
          <p className="heroMessage">{weddingConfig.invitation.message}</p>
          <div className="heroDetails">
            <span><Icon name="calendar" /> {weddingConfig.date.display}</span>
            <span><Icon name="clock" /> {weddingConfig.date.time}</span>
            <a href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
              <Icon name="map" /> {weddingConfig.venue.name}
            </a>
          </div>
          <div className="heroActions">
            <a href="#rsvp">RSVP</a>
            <a href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
              Map
            </a>
          </div>
        </div>
      </section>

      <section className="simpleRsvpSection" id="rsvp">
        <div className="sectionInner simpleRsvpGrid">
          <div>
            <p className="eyebrow">Kindly reply</p>
            <h2>RSVP</h2>
            <p>Please send your response here. It will be saved for the family.</p>
          </div>
          <RsvpForm />
        </div>
      </section>
    </main>
  );
}
