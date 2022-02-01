// styles
import "./../../styles/form.css";

import React, { useState, useRef, useEffect } from "react";
import APIHandler from "../../api/APIHandler";
import { useParams } from "react-router-dom";

const FormArtist = () => {
  const [styles, setStyles] = useState([]);
  const [artist, setArtist] = useState({
    name: "",
    description: "",
    style: "",
    isBand: true,
  });

  const { id } = useParams();

  console.log(id);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the form to reload
    try {
      if (!id) {
        const { data } = await APIHandler.post("/artists", artist);
        console.log("artist: ", data);
      } else {
        const { data } = await APIHandler.patch(`/artists/${id}`, artist);
        console.log("single: ", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(async () => {
    try {
      const { data } = await APIHandler.get("/styles");
      setStyles(data.styles);
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(async () => {
    const { data } = await APIHandler.get("/artists/" + id);
    setArtist(data);
  }, [id]);

  console.log(styles);

  return (
    <>
      <h1 className="title diy">Create New Artist</h1>
      {/* <p>Code a form to Create/Update artists.</p> */}
      {/* <LabPreview name="artistForm" isSmall /> */}
      <hr />

      <form className="form">
        <div>
          <label htmlFor="nom">nom</label>
          <input
            className="input"
            name="name"
            type="text"
            placeholder="name"
            value={artist.name}
            onChange={(e) => setArtist({ ...artist, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="description">description</label>
          <input
            className="input"
            name="description"
            type="text"
            placeholder="description"
            value={artist.description}
            onChange={(e) =>
              setArtist({ ...artist, description: e.target.value })
            }
          />
        </div>

        <div>
          <p>style</p>
          <select
            name="style"
            className="input"
            id="style"
            value={artist.style}
            onChange={(e) => setArtist({ ...artist, style: e.target.value })}
          >
            <option value=""></option>
            {styles.map((e) => {
              return (
                <option value={e._id} key={e._id}>
                  {e.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="row">
          <p>Is Band?</p>
          <label className="label">yes</label>
          <input
            name="isBand"
            id="yes"
            type="radio"
            checked
            value="yes"
            onChange={(e) => setArtist({ ...artist, isBand: e.target.checked })}
          />
          <label className="label">no</label>
          <input
            name="isBand"
            id="no"
            type="radio"
            checked
            value="no"
            onChange={(e) => setArtist({ ...artist, isBand: e.target.checked })}
          />
        </div>

        <button className="button" onClick={handleSubmit}>
          ok
        </button>
      </form>
    </>
  );
};

export default FormArtist;
