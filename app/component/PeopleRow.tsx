export function PeopleRow() {
  return (
    <>
      <div className="section-label">
        <span>
          IN THE ROOM <b>1,284</b>
        </span>
        <span className="host-note">✦ Host is speaking</span>
      </div>
      <div className="people-row">
        <div className="people-stack">
          <span className="person" style={{ background: "#d88b68" }}>
            B
          </span>
          <span className="person" style={{ background: "#6785b9" }}>
            J
          </span>
          <span className="person" style={{ background: "#bc76bb" }}>
            P
          </span>
          <span className="person" style={{ background: "#68a66c" }}>
            T
          </span>
          <span className="person" style={{ background: "#dcaa59" }}>
            K
          </span>
          <span className="person more-people">+1.2k</span>
        </div>
        <span className="people-copy">People are listening together</span>
      </div>
    </>
  );
}
