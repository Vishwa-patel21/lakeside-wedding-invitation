"use client";

import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { weddingConfig } from "@/lib/config";

function Icon({ name }) {
  const paths = {
    calendar: "M7 2v3M17 2v3M3.5 9h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
    map: "M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    heart: "M12 21s-7.5-4.5-9.4-9.1C.9 7.8 3.2 4 7 4c2 0 3.4 1 5 2.8C13.6 5 15 4 17 4c3.8 0 6.1 3.8 4.4 7.9C19.5 16.5 12 21 12 21Z",
    camera: "M4 8h3l1.4-2h7.2L17 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
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
  const [status, setStatus] = useState(null);
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

    setStatus({
      type: "notice",
      text: "Saving your RSVP..."
    });

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

      event.currentTarget.reset();
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
    <main>
      <section className={`hero ${opened ? "isOpen" : ""}`}>
        <div className="petals" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
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
            <span><Icon name="calendar" /> {weddingConfig.date.display}</span>
            <span><Icon name="clock" /> {weddingConfig.date.time}</span>
            <a href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
              <Icon name="map" /> {weddingConfig.venue.name}
            </a>
          </div>
          <div className="heroActions">
            <a href="#rsvp">RSVP on Website</a>
            <a href="#story">Our Story</a>
            <a href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
              Open Map
            </a>
          </div>
        </div>
      </section>

      <section className="detailsBand">
        <div className="sectionInner threeColumns">
          <article>
            <Icon name="calendar" />
            <span>Date</span>
            <strong>{weddingConfig.date.display}</strong>
          </article>
          <article>
            <Icon name="clock" />
            <span>Time</span>
            <strong>{weddingConfig.date.time}</strong>
          </article>
          <article>
            <Icon name="map" />
            <span>Venue</span>
            <strong>{weddingConfig.venue.name}</strong>
            <small>{weddingConfig.venue.line1}</small>
            <a className="inlineMapLink" href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
              Open Google Maps
            </a>
          </article>
        </div>
      </section>

      <section className="sectionInner storySection" id="story">
        <div>
          <p className="eyebrow">Our story</p>
          <h2>A little story of us</h2>
        </div>
        <p>{weddingConfig.couple.story}</p>
      </section>

      <section className="galleryBand" id="couple">
        <div className="sectionInner">
          <div className="sectionHeader">
            <p className="eyebrow">Photos</p>
            <h2>Moments before the celebration</h2>
          </div>
          <div className="photoStrip">
            {weddingConfig.couple.photos.map((photo, index) => (
              <figure key={photo.title} className={`couplePhoto photo${index + 1}`}>
                {photo.src ? (
                  <img src={photo.src} alt={photo.alt} />
                ) : (
                  <div className="photoPlaceholder">
                    <Icon name="camera" />
                    <span>Add Couple Photo</span>
                  </div>
                )}
                <figcaption>{photo.title}</figcaption>
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

      <section className="rsvpBand" id="rsvp">
        <div className="sectionInner rsvpGrid">
          <div>
            <p className="eyebrow">Kindly reply</p>
            <h2>RSVP on this website</h2>
            <p>
              Submit your response here and it will be saved for the family.
              You can also use the photo page to share celebration photos.
            </p>
            <div className="rsvpLinks">
              <a href={weddingConfig.photos.uploadPath}>Guest Photo QR</a>
              <a href={weddingConfig.venue.mapUrl} target="_blank" rel="noreferrer">
                Venue Map
              </a>
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
