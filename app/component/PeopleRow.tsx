import { PresencePerson } from "@/app/types/presence";

export function PeopleRow({ people }: { people: PresencePerson[] }) {
  return (
    <>
      <div className="section-label">
        <span>IN THE ROOM <b>{people.length}</b></span>
        <span className="host-note">✦ Host is speaking</span>
      </div>
      <div className="people-row">
        <div className="people-stack">
          {people.slice(0, 6).map((person) => <span className="person" key={person.sessionId} style={{ background: person.avatar }}>{person.name[0]?.toUpperCase()}</span>)}
          {people.length > 6 && <span className="person more-people">+{people.length - 6}</span>}
        </div>
        <span className="people-copy">People are listening together</span>
      </div>
    </>
  );
}
