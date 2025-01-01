"use client";
import { useState } from "react";
import Image from "next/image";

export default function EmailExamples() {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = async (signatureId: string) => {
    const signatureElement = document.getElementById(signatureId);
    if (signatureElement) {
      const textContent = signatureElement.innerText;
      try {
        const htmlContent = signatureElement.outerHTML;

        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([textContent], { type: "text/plain" }),
          "text/html": new Blob([htmlContent], { type: "text/html" }),
        });

        await navigator.clipboard.write([clipboardItem]);
        setCopySuccess(`Signature ${signatureId} copied!`);
        setTimeout(() => setCopySuccess(null), 2000);
      } catch (err) {
        console.error("Copying failed:", err);
        // Fallback for browsers without Clipboard API support
        try {
          await navigator.clipboard.writeText(textContent);
          setCopySuccess(`Signature ${signatureId} copied (plain text)!`);
          setTimeout(() => setCopySuccess(null), 2000);
        } catch (fallbackErr) {
          console.error("Fallback copying failed:", fallbackErr);
        }
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Email Signature Examples</h1>

      {copySuccess && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {copySuccess}
        </div>
      )}

      {/* Modern Colorful Signature */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature1">
          <table cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td style={{ verticalAlign: "middle", paddingRight: "1rem" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    JD
                  </div>
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      margin: "0 0 0.5rem 0",
                      color: "#FF6B6B",
                    }}
                  >
                    John Davis
                  </h2>
                  <p
                    style={{
                      color: "#4ECDC4",
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.1rem",
                    }}
                  >
                    Executive Director
                  </p>
                  <div
                    style={{
                      backgroundColor: "#F8F9FA",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <p style={{ margin: "0 0 0.25rem 0", color: "#495057" }}>
                      Enterprise Solutions Inc.
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#495057" }}>
                      📞 +1 (555) 123-4567
                    </p>
                    <p style={{ margin: "0", color: "#495057" }}>
                      ✉️ john.davis@enterprise.com
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          onClick={() => handleCopy("signature1")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white rounded hover:opacity-90"
        >
          Copy Signature
        </button>
      </div>

      {/* Modern Dark Signature */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature4">
          <div
            style={{
              backgroundColor: "#1A1A1A",
              padding: "1.5rem",
              borderRadius: "8px",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #FF0080, #7928CA)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                KW
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    margin: "0 0 0.25rem 0",
                    background: "linear-gradient(to right, #FF0080, #7928CA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Kevin Wilson
                </h2>
                <p style={{ color: "#A0AEC0", margin: "0" }}>
                  Senior Developer
                </p>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: "1rem",
              }}
            >
              <p style={{ margin: "0 0 0.25rem 0", color: "#E2E8F0" }}>
                🏢 Digital Solutions Ltd.
              </p>
              <p style={{ margin: "0 0 0.25rem 0", color: "#E2E8F0" }}>
                📱 +1 (555) 987-6543
              </p>
              <p style={{ margin: "0", color: "#E2E8F0" }}>
                💻 kevin.wilson@digital.com
              </p>
            </div>
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #333",
                display: "flex",
                gap: "1rem",
              }}
            >
              <span style={{ color: "#FF0080" }}>GitHub</span>
              <span style={{ color: "#7928CA" }}>LinkedIn</span>
              <span style={{ color: "#00B5D8" }}>Twitter</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleCopy("signature4")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF0080] to-[#7928CA] text-white rounded hover:opacity-90"
        >
          Copy Signature
        </button>
      </div>

      {/* Centered Signature */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature2" style={{ textAlign: "center", width: "100%" }}>
          <table
            style={{ width: "100%", textAlign: "center" }}
            cellPadding="0"
            cellSpacing="0"
          >
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <div
                    className="w-[100px] h-[100px] rounded-full bg-blue-300 mx-auto mb-4 flex items-center justify-center"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      backgroundColor: "#93C5FD",
                      margin: "0 auto 1rem auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ES
                  </div>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Emma Smith
                  </h2>
                  <p style={{ color: "#4B5563", margin: "0 0 0.5rem 0" }}>
                    Marketing Manager
                  </p>
                  <div style={{ marginTop: "0.5rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      Global Marketing Inc.
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      📱 +1 (555) 234-5678
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      📧 emma.smith@globalmarketing.com
                    </p>
                    <p style={{ margin: "0" }}>🌐 www.globalmarketing.com</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          onClick={() => handleCopy("signature2")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy Signature
        </button>
      </div>

      {/* Right-aligned Image Signature */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature3">
          <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: "middle" }}>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Peter Thompson
                  </h2>
                  <p style={{ color: "#4B5563", margin: "0 0 0.5rem 0" }}>
                    Technical Director
                  </p>
                  <div style={{ marginTop: "0.5rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      Tech Innovations LLC
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      123 Main St, New York
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0" }}>
                      ☎️ +1 (555) 345-6789
                    </p>
                    <p style={{ margin: "0" }}>
                      📨 peter.thompson@techinnovations.com
                    </p>
                  </div>
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                    paddingLeft: "1rem",
                    width: "80px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#86EFAC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    PT
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          onClick={() => handleCopy("signature3")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy Signature
        </button>
      </div>

      {/* Real Estate Agent Signature with Services */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature5">
          <div
            style={{
              background:
                "linear-gradient(to right, #2C5364, #203A43, #0F2027)",
              padding: "1.5rem",
              borderRadius: "8px",
              color: "white",
            }}
          >
            <div
              style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🏠</span>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    margin: "0",
                    color: "#64B5F6",
                  }}
                >
                  Sarah Anderson
                </h2>
                <p style={{ color: "#90CAF9", margin: "0.25rem 0" }}>
                  Senior Real Estate Consultant
                </p>
                <p style={{ color: "#E1F5FE", margin: "0.25rem 0" }}>
                  Luxury Homes Specialist
                </p>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: "0.25rem 0", color: "#B3E5FC" }}>
                📱 +1 (555) 123-4567
              </p>
              <p style={{ margin: "0.25rem 0", color: "#B3E5FC" }}>
                📧 sarah@luxuryestates.com
              </p>
              <p style={{ margin: "0.25rem 0", color: "#B3E5FC" }}>
                🌐 www.luxuryestates.com
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "#64B5F6", margin: "0 0 0.5rem 0" }}>
                My Services:
              </h3>
              <ul
                style={{ margin: "0", paddingLeft: "1.5rem", color: "#E1F5FE" }}
              >
                <li>Luxury Home Sales & Acquisitions</li>
                <li>Investment Property Consulting</li>
                <li>Property Valuation & Market Analysis</li>
                <li>International Real Estate Services</li>
              </ul>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: "1rem",
              }}
            >
              <span style={{ color: "#64B5F6" }}>LinkedIn</span>
              <span style={{ color: "#64B5F6" }}>Instagram</span>
              <span style={{ color: "#64B5F6" }}>Facebook</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleCopy("signature5")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#2C5364] to-[#203A43] text-white rounded hover:opacity-90"
        >
          Copy Signature
        </button>
      </div>

      {/* Creative Designer Signature */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature6">
          <div
            style={{
              background: "linear-gradient(135deg, #FF61D2, #FE9090)",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h2
                  style={{
                    fontSize: "2rem",
                    background: "linear-gradient(to right, #FF61D2, #FE9090)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: "0",
                  }}
                >
                  Alex Creative
                </h2>
                <p style={{ color: "#666", margin: "0.5rem 0" }}>
                  UI/UX Designer & Digital Artist
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                  margin: "1rem 0",
                  padding: "1rem 0",
                  borderTop: "2px solid #f0f0f0",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <div>
                  <p style={{ margin: "0", color: "#FF61D2" }}>
                    📧 alex@creative.studio
                  </p>
                  <p style={{ margin: "0", color: "#FF61D2" }}>
                    🎨 creative.studio/alex
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", color: "#FE9090" }}>
                    📱 +1 (555) 987-6543
                  </p>
                  <p style={{ margin: "0", color: "#FE9090" }}>
                    🌍 Los Angeles, CA
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <span style={{ color: "#FF61D2" }}>Behance</span>
                <span style={{ color: "#FF61D2" }}>Dribbble</span>
                <span style={{ color: "#FE9090" }}>Instagram</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleCopy("signature6")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF61D2] to-[#FE9090] text-white rounded hover:opacity-90"
        >
          Copy Signature
        </button>
      </div>

      {/* Tech Startup Signature */}
      <div className="mb-8 border p-4 rounded">
        <div id="signature7">
          <div
            style={{
              background: "#000",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #333",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  background: "linear-gradient(45deg, #00F5A0, #00D9F5)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🚀
              </div>
              <div>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "1.5rem",
                    color: "#fff",
                  }}
                >
                  Mike Johnson
                </h2>
                <p
                  style={{
                    margin: "0",
                    background: "linear-gradient(to right, #00F5A0, #00D9F5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Founder & CEO
                </p>
              </div>
            </div>

            <div
              style={{
                margin: "1rem 0",
                padding: "1rem 0",
                borderTop: "1px solid #333",
                borderBottom: "1px solid #333",
              }}
            >
              <p style={{ margin: "0.25rem 0", color: "#888" }}>
                TechFlow Solutions
              </p>
              <p style={{ margin: "0.25rem 0", color: "#888" }}>
                📱 +1 (555) 234-5678
              </p>
              <p style={{ margin: "0.25rem 0", color: "#888" }}>
                💌 mike@techflow.io
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                color: "#00F5A0",
              }}
            >
              <span>Twitter</span>
              <span>LinkedIn</span>
              <span>GitHub</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleCopy("signature7")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-white rounded hover:opacity-90"
        >
          Copy Signature
        </button>
      </div>
    </div>
  );
}
