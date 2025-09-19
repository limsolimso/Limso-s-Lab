/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';

const App = () => {
  // State for each input field
  const [plot, setPlot] = useState('');
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('');
  const [writingType, setWritingType] = useState('storybook');
  const [ageGroup, setAgeGroup] = useState('middle school');
  const [proficiency, setProficiency] = useState('lower-intermediate');
  const [includeGrammar, setIncludeGrammar] = useState('');
  const [excludeGrammar, setExcludeGrammar] = useState('');

  // State for API interaction
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setError('');
    setStory('');

    // Construct the prompt from the form fields
    const finalPrompt = `
You are a story generator. The user will provide conditions in separate fields or by selecting options. Use those conditions to create a complete text.

Here are the conditions the user has provided:

General Plot: ${plot || 'A brother and sister traveling to foreign countries.'}
Theme to Emphasize: ${theme || 'Cultural experiences, small mistakes, and meaningful lessons.'}
Tone/Style: ${tone || 'Simple, warm, and encouraging.'}
Type of Writing: ${writingType}
Target Reader Age Group: ${ageGroup}
Reader Proficiency Level: ${proficiency}
Grammar Features to Include:
${includeGrammar || `- gerunds
- sense verbs + adjective (e.g., 'look happy')
- subjective relative pronouns (who, which, that as subjects)
- adverbs of frequency
- present perfect (but not present perfect progressive)
- so…that clauses
- passive voice
- comparative degree (but not double comparative structures like 'the more…the more')
- objective relative pronouns (whom, which, that as objects)
- participles expressing emotion (e.g., 'surprising', 'excited')
- 'It' as a dummy subject (e.g., 'It is important to…')
- indirect questions
- object complements (e.g., 'make me happy')
- if clauses`}
Grammar Features to Exclude:
${excludeGrammar || `- present perfect progressive
- the relative pronoun 'what'
- non-restrictive relative clauses
- participles modifying nouns from behind (e.g., 'the man standing there')
- past perfect
- conjunctions like 'although, unless, whereas'
- if/whether used for indirect yes/no questions
- passive voice of modal verbs (e.g., 'must be done')
- idiomatic 'It is/was ~ for ~ to ~' expressions
- relative adverbs (when, where, why as relative pronouns)
- the comparative (… the comparative) structure (e.g., 'the more, the better')
- participle clauses (e.g., 'Walking down the street, he…')
- past subjunctive (e.g., 'If I were you…')
- 'so that' purpose clauses`}

Your task:

Write the text entirely in English.
Follow the user’s conditions strictly.
Keep the language level appropriate for the chosen reader age and proficiency.
If the writing type is “storybook,” divide it into short chapters with titles.
Ensure the grammar rules (include/exclude) are respected.
Make the text coherent, warm, and engaging.
Keep the total length under 1000 words, unless the user sets a different limit.
    `;

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalPrompt,
      });

      setStory(response.text);

    } catch (err) {
      console.error(err);
      setError('Failed to generate story. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Grammar-Aware Story Generator</h1>
      
      <div className="form-grid">
        <div className="form-field full-width">
          <label htmlFor="plot">General Plot</label>
          <input id="plot" type="text" value={plot} onChange={(e) => setPlot(e.target.value)} placeholder="A brother and sister traveling to foreign countries." />
        </div>
        
        <div className="form-field">
          <label htmlFor="theme">Theme to Emphasize</label>
          <input id="theme" type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Cultural experiences, small mistakes, and meaningful lessons." />
        </div>

        <div className="form-field">
          <label htmlFor="tone">Tone/Style</label>
          <input id="tone" type="text" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Simple, warm, and encouraging." />
        </div>

        <div className="form-field">
          <label htmlFor="writingType">Type of Writing</label>
          <select id="writingType" value={writingType} onChange={(e) => setWritingType(e.target.value)}>
            <option value="storybook">Storybook</option>
            <option value="story">Story</option>
            <option value="essay">Essay</option>
            <option value="poem">Poem</option>
            <option value="article">Article</option>
            <option value="sci-fi narrative">Sci-Fi Narrative</option>
          </select>
        </div>

        <div className="form-field">
            <label htmlFor="ageGroup">Target Reader Age Group</label>
            <select id="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                <option value="elementary">Elementary School</option>
                <option value="middle school">Middle School</option>
                <option value="high school">High School</option>
                <option value="university">University</option>
                <option value="general">General</option>
            </select>
        </div>

         <div className="form-field">
            <label htmlFor="proficiency">Reader Proficiency Level</label>
            <select id="proficiency" value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="lower-intermediate">Lower-Intermediate</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>
        </div>

        <div className="form-field full-width">
          <label htmlFor="includeGrammar">Grammar Features to Include</label>
          <textarea
            id="includeGrammar"
            className="grammar-input"
            value={includeGrammar}
            onChange={(e) => setIncludeGrammar(e.target.value)}
            placeholder={`- gerunds
- sense verbs + adjective (e.g., 'look happy')
- subjective relative pronouns (who, which, that as subjects)
- adverbs of frequency
- present perfect (but not present perfect progressive)
- so…that clauses
- passive voice
- comparative degree (but not double comparative structures like 'the more…the more')
- objective relative pronouns (whom, which, that as objects)
- participles expressing emotion (e.g., 'surprising', 'excited')
- 'It' as a dummy subject (e.g., 'It is important to…')
- indirect questions
- object complements (e.g., 'make me happy')
- if clauses`}
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="excludeGrammar">Grammar Features to Exclude</label>
          <textarea
            id="excludeGrammar"
            className="grammar-input"
            value={excludeGrammar}
            onChange={(e) => setExcludeGrammar(e.target.value)}
            placeholder={`- present perfect progressive
- the relative pronoun 'what'
- non-restrictive relative clauses
- participles modifying nouns from behind (e.g., 'the man standing there')
- past perfect
- conjunctions like 'although, unless, whereas'
- if/whether used for indirect yes/no questions
- passive voice of modal verbs (e.g., 'must be done')
- idiomatic 'It is/was ~ for ~ to ~' expressions
- relative adverbs (when, where, why as relative pronouns)
- the comparative (… the comparative) structure (e.g., 'the more, the better')
- participle clauses (e.g., 'Walking down the street, he…')
- past subjunctive (e.g., 'If I were you…')
- 'so that' purpose clauses`}
          />
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleGenerateStory} disabled={isLoading || !plot}>
          {isLoading ? 'Generating...' : 'Generate Story'}
        </button>
      </div>

       {error && <p className="error-message" role="alert">{error}</p>}

      <div className="output-section">
        <label htmlFor="story-output">Generated Story</label>
        <div id="story-output" className="output-content" aria-live="polite">
            {isLoading ? <div className="loader"></div> : story ? story : <p className="placeholder">Your generated story will appear here...</p>}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);