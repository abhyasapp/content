/* ----------------------------------------------------------------------
   CHAPTERS-DATA.JS -- ABHYAS AUTO-GENERATED
   ??????????????????????????????????????????????????????????????????????
   Four-level shape:  level -> chapter -> subtopic -> file(s)

   Every chapter ends with:
     ? '<prefix>.<N+1> Mixed Questions'    -- pooled unclassified, part N
     ? '<prefix>.<N+2> Original Questions' -- every unique source file

   Classified subtopics use leaves 'All' or 'part N'.
   Mixed Questions uses 'part 1', 'part 2', ...
   Original Questions:
     -- L5 / L7 : '<Book>.<range>'         e.g. 'DPARSAD.1-100'
     -- GK      : '<topic>'                e.g. 'constitution'
   Empty Mixed/Original buckets are omitted entirely.
   ---------------------------------------------------------------------- */

const CH_NAMES = {
  "gk": {
    "1": "General Awareness",
    "2": "Management",
    "3": "IQ"
  },
  "level5": {
    "1": "Surveying",
    "2": "Construction Materials",
    "3": "Mechanics of Materials and Structures",
    "4": "Hydraulics",
    "5": "Soil Mechanics",
    "6": "Structural Design",
    "7": "Building Construction Technology",
    "8": "Water Supply and Sanitation",
    "9": "Irrigation Engineering",
    "10": "Highway Engineering",
    "11": "Estimating and Costing",
    "12": "Construction Management",
    "13": "Airport Engineering"
  },
  "level7": {
    "1": "Structural Engineering",
    "2": "Engineering Survey",
    "3": "Construction Materials",
    "4": "Concrete Technology",
    "5": "Geotechnical Engineering",
    "6": "Construction Management",
    "7": "Estimating & Costing",
    "8": "Engineering Drawing",
    "9": "Engineering Economics",
    "10": "Professional Practices"
  }
};

const LEVEL_LABELS = {
  "gk": "General Knowledge (shared)",
  "level5": "Level 5 — Diploma",
  "level7": "Level 7 — Engineering"
};

const DRIVE = {
  "gk": {
    "1": {
      "1.1 GEO&DEMO": {
        "All": "1Qmba_WrNWGNqECga2p8Vol6z4bJPepSg"
      },
      "1.10 CURRENT AFFAIRS": {
        "All": "1gMp1mRvRPY8wCsf0DTfIWgWtAbFWmgz4"
      },
      "1.2 NAT RESOURCES": {
        "All": "1Qb_LUBogSS81RuXIv050eh2KM72rOvbq"
      },
      "1.3 PERIODIC PLAN": {
        "part 1": "1r_WV4MYDksyjt4sqniSAdYs_6OV1GzZu",
        "part 2": "1hywTphzxHr0ly5Qus_V5pcluAYBxfg6i"
      },
      "1.4 SUST DEV&ENV": {
        "part 1": "1Qsmztto14yFc7wyJ3Y8vZQkA-W9JYmus",
        "part 2": "1WMAYIixgLx_TQ9_14n40iEmzhjn0YwF3"
      },
      "1.5 SCIENCE & TECH": {
        "part 1": "1_R7tpIqypYqgyHgwx2FgnRbK8Ki55W7k",
        "part 2": "1YbOzQbEB80jS_2zKCxoqKqmlwjYLeeAl"
      },
      "1.6 PUBLIC HEALTH": {
        "All": "1CNb0pYlKKkCtUadWJ6Dm871SFAjn4-O7"
      },
      "1.7 CONSTITUTION": {
        "part 1": "1wGQ-gSK4xk8gcMXzlMu3Z8gBziEvmZnB",
        "part 2": "1qBGNzbQ4TCD3opUxQ3JpNOEx1DohixGt"
      },
      "1.8 INTL AFFAIRS": {
        "part 1": "13aQeqq0a-SuHmqSKyoTL-bUo6B0_Jiep",
        "part 2": "1H2AEbMfDEEITOWjDL_yHZD6aajGoexwk",
        "part 3": "1BPqOeVJxHANlGFbp9g5bR0wpReNfoFh5"
      },
      "1.9 REGIONAL ORGS": {
        "part 1": "1ZNQw-u8OtlATWc_Qxbh59lc7UlB56sQE",
        "part 2": "1abuGAg0dyAV7UubVWyFstOQksvsV16j3",
        "part 3": "18Xn-ErWB9eI7ILAulVFfSjniPcIdNPvk"
      },
      "1.12 Original Questions": {
        "Asoj gorkhapatra_mcq_1-20_english": "1a39wiEFIDn2iQBAqwVvVag9-UpTUYZvz",
        "constitution": "1HRlsrjjxF8tW89R4fT9wTGjAnFt0gfVS",
        "Current Plan": "1S39S--nt9QVepKlcszdpntB8rRgAEqfd",
        "gorkhapatra_asoj21_mcq_1-17_en": "1qioOBHc0tqVy0ILDG762xmRenhajczgD",
        "international affairs": "1pomfoXhK1mWU7QAO-oihx2SMsPJqxOCh",
        "international relations 101-150": "1TTD1aKKl_P6nGcUxzyyDkpbH2O7hPx_u",
        "international relations 151-180": "1dEdvbPuxrSKys_jlMAJkaHGLuSHQ47fF",
        "saarc_mcq_batch1": "1mgbD6Zr3t5zu7oGAraj1BeIXOqbGSojp",
        "saarc_mcq_batch2": "1SWybO9ZCwzFPvAY6k_8StQk9Nf04MZzm",
        "Sustainable Development": "1V6qlxozhzcCxkdwHDGWzvsNvROvPdHuu"
      }
    },
    "2": {
      "2.1 OFFICE MGMT": {
        "All": "1rtYurcMxcrVOIIbAi6SV2Hh4t64PHmEv"
      },
      "2.10 HUMAN VALUES": {
        "All": "1cJjeSO8nBF_3AE6DwKfhTZex18dPlKh9"
      },
      "2.2 CIVIL SERVICE ACT": {
        "part 1": "1NVhLlC9_Xzpv6B1JgLa7Uu6DjF8bBAuJ",
        "part 2": "1_L7DaE_s3roLKd0SIZMNhbTojkgEsqoW"
      },
      "2.3 FEDERAL MINISTRY": {
        "All": "13lZvSloMVg6uTu2LymNprwNnW8cYm5BG"
      },
      "2.4 CONSTITUTIONAL BODIES": {
        "All": "1dQIQg0BAEVgyHERgKMOsAV11iVBDggUu"
      },
      "2.5 BUDGET & ACCOUNTING": {
        "All": "1_V96ofrNF7xZCpemx661Pm3DVRN8E9Yk"
      },
      "2.6 SERVICE DELIVERY": {
        "All": "1B-M7lOtGQpvTI7gBaozm9YVsOsVcssBO"
      },
      "2.7 GOVERNANCE": {
        "part 1": "1xxrBZZUBE472hbAP9q9gbxxxIOssqiJU",
        "part 2": "19_lYuU2KkcuytFB4VFfnFReJRd8TjbY-"
      },
      "2.8 PUBLIC CHARTER": {
        "All": "11IYcqGMONLgHeRrvtsvw4F7Ip63y74Pd"
      },
      "2.9 MGMT FUNDAMENTALS": {
        "part 1": "1o_CA3vV9mmq8pbTZV2RxoHSTpcfofKs2",
        "part 2": "1Az9BS4MQb2Oa3_9RJRR9EfRmH4pUXgMu",
        "part 3": "1SweNR_V47WAC-L-mh1GnFqto9jBtB6W8"
      },
      "2.12 Original Questions": {
        "Citizen Charter": "1SkPP7n4nIjmdEzWu8zZ5nywQaY2BmGQD",
        "Functional Scope Public Service": "1TdUQchW6i2LBKdWsjMNNTGwB5hAR1iCB",
        "fundamentals of management": "1G5BtPfzG_bnmDhIORtJM6N5cmCEiAt3A",
        "fundamentals of management (2)": "1Gzu0Or4R4TufdNbRAfIvuWsstiNRJzJ3",
        "Fundamentals of management part 2": "1pqYGgBageMaEsa6QZoCcqzpjr1Bpd3DA",
        "governance": "1xO4bk4QCPzqCORupW07MtNj-60OFlqZE",
        "nijamati ain": "1W628YzIRlatpN0BhdtVqv1V7q44Fn8F0",
        "Public Policy": "1u3hA3p7wtUaDvzDioLVrFaq02WUuNCpt"
      }
    },
    "3": {}
  },
  "level5": {
    "1": {
      "1.1 General": {
        "All": "1dnEX5DyMaOsHCqxztfG-Efz6gTQ_k9BK"
      },
      "1.2 Levelling": {
        "All": "1djArchTP0Ix-2StJwyaAEUTI-2nkyHId"
      },
      "1.3 Plane Tabling": {
        "All": "1GBsWW0GeCumb4qn5U7nQ9GrW19bDiUUD"
      },
      "1.4 Theodolite and Traverse": {
        "All": "1cWwnTSkKV1XGCvv0E_efT3yxVn7WVu4G"
      },
      "1.5 Contouring": {
        "All": "1_JPdKDNtm4mGFpqV28sb43j2Veh6AIg6"
      },
      "1.6 Setting Out": {
        "All": "18qMRBy9UNbA-90VgPPRPHbNRR6Qa-FeL"
      },
      "1.8 Original Questions": {
        "Sunil Sah.301-400": "13z92Vn1uV7Gw217q-GXQVuOQoV9gUrJO",
        "Sunil Sah.401-500": "1OikW1FEi5Zuei4IrWpbjsTr3-O_hY8PQ",
        "Sunil Sah.501-575": "1WUg2w7SlHVpAEyOlFyfbnymQ-xivfwNi",
        "Sunil Sah.1-100": "1OAlD5XUf-Ecmj4hNViPAqInI5GUcMExG",
        "Sunil Sah.101-200": "1Q6E7isqILUnHG9ZPxTsIltIlEodqr05i",
        "Sunil Sah.201-300": "1vZRNltiqTuJxJn8RVCzrSojNeyRYFEfp"
      }
    },
    "2": {
      "2.1 Stone": {
        "part 1": "1FhKGL2R8QXruPJPli6XtVnpvdbz2tDVE",
        "part 2": "1Zw3ASWu7ciK7trahCzE9b0r2NPGPG_-Z",
        "part 3": "19gS9F8yLhntOSlSBdtWWq00KONn2x9el",
        "part 4": "1yI8-mg9EYlX-Aiv9alLzd4bihjkbj_ta"
      },
      "2.2 Cement": {
        "part 1": "1ugdGye2XxGydNAML0-Jb9B0B13dlIsLM",
        "part 2": "1pQ8ue3SWOWXmLX002M2oYgYIJ5oEJRB6",
        "part 3": "1dj3idwzHEZ88QakZ4S11FuyYDg3ZhIIf",
        "part 4": "18uWyWwCUljfq-QmvTCeqhS4Mudoz3_nd",
        "part 5": "1vGCPk8eRCzqadrQMceSwTOZS-LyqVOxw"
      },
      "2.3 Clay and Clay Products": {
        "part 1": "1WTAgJhd7SGFdZNZLPCoENpRgIzdY6M3d",
        "part 2": "1D84E1IcU9ldNklYltuBek6QZ_9oATfh_"
      },
      "2.4 Paints and Varnishes": {
        "part 1": "1KLYUTtuYeO_F1vJ2wnh2XiRxDUj0pxFI",
        "part 2": "1ZeekQo9uCDugN6rIyP_ApiPYG9oMeqDQ"
      },
      "2.5 Bitumen": {
        "All": "183yk0ule2vXE0ua_hnIQ07hTOXIE7677"
      },
      "2.6 Mixed Questions": {
        "part 1": "1OJgiEK95-AEHGotCVFZegI3v6gZR12vs"
      },
      "2.7 Original Questions": {
        "DPARSAD.1-100": "1DCi7TZlsRLXbswMXZ_phkNSvpvR4qEYC",
        "DPARSAD.101-200": "1l2_oKmLGjbMZJAY2EXniIcsXBjgox1LI",
        "DPARSAD.201-300": "1D-Q5Dx7r_PeLb8tuQSJrfdDsSFwje__V",
        "DPARSAD.301-400": "1Ofpj_R63e8ibarImI4Kx4Hjk1GZ5aknd",
        "DPARSAD.401-500": "1WLSUMqyN8bnj9WuQPGRNxK0ssMqDtJ-O",
        "DPARSAD.501-613": "1bQ-eFt4DnPTkejie6Jf435EtGEiwVobO"
      }
    },
    "3": {
      "3.1 Mechanics of Materials": {
        "part 1": "1_cYyrSPf87PDlnynPYWLY92yQoyVqsxg",
        "part 2": "1qiRelfO5nKYDJOI7EfaPZhZO0F7xH9PU",
        "part 3": "1dZcd9E4z4CdfTthwf9d3D-YUR-yioC84",
        "part 4": "12fJLAGf-M0aenxLBZaXCRYaXf1IYDMfd",
        "part 5": "1r527eILQdyRvJG1yLNBTe8wHgjUxwPzh"
      },
      "3.2 Mechanics of Beams": {
        "part 1": "1_uJNED3KLJdUtzIkOMVVzqCZVl7rSWWv",
        "part 2": "136k6GpuENftb2FBZpR4h-L51LvboiMj1",
        "part 3": "15Q9FSCPM00JaH1iwskC0--eYBRWlC3y8",
        "part 4": "143N94xYxyMM21HCmKUUKKSmbkD2tKY3O",
        "part 5": "1U3CyYkJaFKF8gZzxENsKLq6uGSu_XBZj"
      },
      "3.3 Simple Strut Theory": {
        "All": "11TR-BDQvFrcXzwtPk2Ea98nValjV8sEf"
      },
      "3.5 Original Questions": {
        "DPARSAD.1-53": "1RWIKVWCl9djWzUyAL0fMOoeNLIYQfQAo",
        "DPARSAD.54-116": "18XMCDrjLIHKW8aHJYleGOgsnBFX5ANyH",
        "DPARSAD.117-164": "1zkZh7YFEn_-fyk1QfxBtl3VvQ5aY-Euk",
        "DPARSAD.165-187": "1ZOWTP4bQeuvcwui5xkjqppdCUBY_WT-0",
        "DPARSAD.188-221": "1_1IxcEHCZPlqN5JfT0agDZXoUxBmiroN",
        "DPARSAD.222-250": "1q3-aYC9cL7u7Ga4r5kGgGVE9BCiipX8J",
        "Sunil Sah.101-200": "1WqWfdmpL-boetcfcaRVkAD07U2wScgMz",
        "Sunil Sah.201-300": "1P75cTo6Emx6cKMjhKpSHObrcIZK_Q48Z",
        "Sunil Sah.301-400": "1iltEhT0DIWa98sAnRSZs7l83Sl5Fp4PA",
        "Sunil Sah.401-432": "1H1u78Q95fPXDAzALAwMF2PyrKYqwIluc",
        "Sunil Sah.1-100": "18PHUlO1w4w1P6fAJFl1sVA-vuaArgX4c"
      }
    },
    "4": {
      "4.1 General": {
        "part 1": "1j9dCNWwgsleRhEuSFHLKM6r3JX8sFr6w",
        "part 2": "1FdXk8uintoJhBETxkgi0eG6lbmKgVms6",
        "part 3": "14CUSFpVA9RWvFByKmxbu6M_8RZ5utTq9",
        "part 4": "1eANScylLdzR4Eig94OAuW6DGQPGrMRxG",
        "part 5": "1iIlwv00JK6TzwC8dWTxyQI2LxKJGUhdG"
      },
      "4.2 Hydro-Kinematics and Dynamics": {
        "part 1": "1V1l53NwhXTnibR6aAiwP6iMsY6pDf-5l",
        "part 2": "1hnY_CuzgnfrOD9Oj625wTBLtdOp4WNPf",
        "part 3": "1Zu_GXWNnX9492XOeERjJbfDA_1RGlns9"
      },
      "4.3 Measurement of Discharge": {
        "part 1": "1OaHc76sB8WsoKPz2Xnfy-RTrUkP-rPef",
        "part 2": "1C0UgcdP8pkoPZDOhVyXJPX4wIDekJu1R",
        "part 3": "1Zri2FAbKqfNOKLB0xpiuirqQ4HVq2oPV"
      },
      "4.4 Flows": {
        "part 1": "1-R_vl-gtaeQGmyC6NNWj5hcMIDco4UEw",
        "part 2": "1rDUkjE4ksb33KmbxfSzjpDQEIZ97X_W1"
      },
      "4.6 Original Questions": {
        "DPARSAD.1-100": "1W0Haw_2D00dCGnytzmtiDG40WXiW356m",
        "DPARSAD.101-200": "1q0lScj2EGQYv7n16ZY2qbluOG_xWtgd_",
        "DPARSAD.201-300": "1--gbS8anKXq77VRjm76vm1JzPBQ81NjY",
        "DPARSAD.301-400": "1TcZcXzv7A7eQP_WK7EEySIfWVESgF-fQ",
        "DPARSAD.401-450": "1YwIBiSps43xKr3d5qeODQpW4bQcEFTNj",
        "DPARSAD.451-520": "1WOcNHBJKZJzcjKDTKz215XvGN7N3o7WR"
      }
    },
    "5": {
      "5.1 General": {
        "part 1": "1eIMdOsFOZTHW9oMeRGnBFwNmYGsx4P0r",
        "part 2": "16fqCyNxhDZCHjkG19xvR0uvRUKlp-7rr"
      },
      "5.2 Soil Water Relation": {
        "All": "1ugI_WOtoiXzbRPiX44iFElWIrfkwVnUi"
      },
      "5.3 Compaction of Soil": {
        "All": "1iMTC-RYXLHkCCaGH-W_r-96qcadZL2Cd"
      },
      "5.4 Shear Strength of Soils": {
        "All": "1z3N5QglcIiUHink7N1DFM1V277wBeANw"
      },
      "5.6 Foundation Engineering": {
        "All": "1Wo0SOjZ5pmq_u5TrCjHh8S-wBtFCwekp"
      },
      "5.8 Original Questions": {
        "DPARSAD.1-100": "11DZsjZfw4WbmglOxGRErYh9VBNv1-yy7",
        "DPARSAD.101-200": "1l6ZBNY7MlRItTKOsglSF9xDGEQ_hrVZI",
        "DPARSAD.201-300": "1ZMPdpgCvJ4LNPVSr0enHKyGxVIr7QLth",
        "DPARSAD.301-400": "1zKOJP55egY2xSu8yxTbQZwRulKyyqwb3"
      }
    },
    "6": {
      "6.1 RC Sections in Bending": {
        "part 1": "1TzfohYBvWj6PEOOuWwuiQuvhkxZ9Hr3L",
        "part 2": "1SLtQfLA4EnfqpDP-QOct0dnADJG8SZdl",
        "part 3": "1i0kVGqMCMduIMue2wKHVeNsLuEJSmqCT",
        "part 4": "1h-O9SlVMblNtiMcZ3tX91ee9AApBFaP7"
      },
      "6.2 Shear and Bond for RC": {
        "part 1": "1sCYQPve0nmKyrxcGxZitB7L4zV2W9Iqm",
        "part 2": "1Pgjim1YYAkqGKVaYt5vyz7gyXL_FAveI"
      },
      "6.3 Axially Loaded RC Columns": {
        "part 1": "1pjFdF6M38EtfHXCDf4ndTEl0D_GhPU8t",
        "part 2": "14q5tZ2hJnreHk5rQETQci1YtAFCe_ghb"
      },
      "6.4 Design and Drafting of RC": {
        "part 1": "1ROw0eCBjq4TG0qyLU1qOt3P5hS_9fFHi",
        "part 2": "1-H57cjtbLn2EDgogp9pCSlb7OWa_noIT",
        "part 3": "1LBsICwDnxDlBUNIh100CDscDUiFGYVTd"
      },
      "6.5 Mixed Questions": {
        "part 1": "1B8ghmPRkN2qMF8Wb8eVhLVH3ykcjH2Kg"
      },
      "6.6 Original Questions": {
        "DPARSAD.1-100": "1ZTRwGwGkdg6DpZzVizUQEkF-Z1IQT3a2",
        "DPARSAD.101-200": "1NJIDXdgssUhX0QcnmIIN0QLWQjuP-gjs",
        "DPARSAD.201-300": "1n7Qn2gqNo6du6XKb7AjwBypuJIKKqXEd",
        "DPARSAD.301-360": "1utWod1N1YyvWcxXTa-UkD6YobEPmVXri",
        "DPARSAD.361-417": "1i9tauS85s-o8G3L49QgmBaE-6isjbRLW"
      }
    },
    "7": {
      "7.1 Foundations": {
        "part 1": "1fluyGbVwBsdnr3qyMqyKI2bvXUVsFQW2",
        "part 2": "1ybqEUBMiCRl16hbLNSCpnwckLj23WBTs",
        "part 3": "1uQh4WOyiZDvsAMH3n-dbKs6lD2xOIzq4",
        "part 4": "10-LuZpKLr3ICGqnNxKB0kwxPp7cISn2d"
      },
      "7.2 Walls": {
        "part 1": "19_MQiSHhJjj95GOlk5ICjsfIMW4dUJff",
        "part 2": "1KyWgAjOCTaWiPj2Vk9lhBQ2FeXkQYjjb",
        "part 3": "17uBUhcrv1K1bpP5kPtOL91SG-J-2-ZJ2",
        "part 4": "1stwapiZPxUfj-8d0L-v6Ff2z-7xPMQdW",
        "part 5": "1gnCRJ6OMkGdjRv_et2-aR05q7SiBwOrm"
      },
      "7.3 Damp Proofing": {
        "All": "1t3LlRKBe_9VvEaAIYTIRadXOiTHiC1yZ"
      },
      "7.4 Concrete Technology": {
        "part 1": "1mqPagvPY6BEaOFhBKGg3HiY-d2jtain_",
        "part 2": "1LJGUCRiBxG6Jk4s_R0Q13ZBy2hi0k7Xm"
      },
      "7.5 Wood Work": {
        "part 1": "1kGH3ITK44QJWFAslbDLeGK8E5qYHRaFF",
        "part 2": "177XsVpd8Kr2yOMHayBzSIWr8eZvHcKZC",
        "part 3": "1ma5WxgWsbac2R8e8s4zj9-wgKASRkEf9",
        "part 4": "1W3MhoKoJhXH8sWTJ4BROKC54ixnV4HdQ"
      },
      "7.6 Flooring and Finishing": {
        "part 1": "1cBHJkqxn8n0N_fInKmXI6ysS4YtGKTeI",
        "part 2": "1TlvsNKP7H6AH4iHcgO7fFKsoMsFZEbgb"
      },
      "7.7 Mixed Questions": {
        "part 1": "1n8C4KUtPP6Zdkyjse73zU115mDYktWYP"
      },
      "7.8 Original Questions": {
        "RK SHRESTHA.1-65": "1kzYm9czns3Do26a2XV8-tTm5VSJ_TUXt",
        "RK SHRESTHA.196-260": "1mZP6ujsccyC8OlKwMyGssf9t4st7-sPB",
        "RK SHRESTHA.65-130": "164FLjujhfBl-q2Q_CaYcuW0T89fY1avd",
        "RK SHRESTHA.131-195": "19DsKXwT_RSX1B_xlQHz06tR0J8HLNf1C",
        "Sunil Sah.1-100": "1H8b2DIcDQQ4dCDRaJctM6mYOyMMa7Rh-",
        "Sunil Sah.101-200": "1jYggTJbHhYxZDvroz5XIk-1O-I-trv5A",
        "Sunil Sah.201-300": "15f2CiEgfd0y45C6YiAujV35bpvHBpGnG",
        "Sunil Sah.301-400": "1upPz6YXp7yLLjz73lnzUP828EFApy-Mb",
        "Sunil Sah.401-500": "1eVtbEWc9LGsLty0Y2ZM6PDeIk2ykBP2b",
        "Sunil Sah.501-600": "1_tytL1YFi_8glzjswiGKelgkQrvNNAfQ",
        "Sunil Sah.601-658": "1V_Cgasu59PipCReiiMRzcqeKDHwTfDoe",
        "Sunil Sah.659-716": "161Hw8Db80fggFIBHTkzKwiDqm9oApAA7"
      }
    },
    "8": {
      "8.1 General": {
        "part 1": "1l3ErSuENaR7ntqGdvMQ5-1g-ZYjhWA_6",
        "part 2": "1iIimOtb7gEWu31RBENVoIVP-P_35NG3j",
        "part 3": "14xsWqYwJfob9KMtxcg1n2FTrQs0D0LgG",
        "part 4": "1f5AGW7WZaj_Kes9DuHlGWxe9NwoMsrv0",
        "part 5": "1CaUdNB0kdaDuPI6HTfLruvy_wqYNATnd",
        "part 6": "1imX_QpVJhbbtnEitR6UeyGjz5Mazvr79",
        "part 7": "1QuVUez4GVy17Y0kWlzYyA83iPn82ygDS"
      },
      "8.2 Gravity Water Supply System": {
        "All": "1btQwCBtHuqdWr3IlSOqi6AF0eGnlJ6rw"
      },
      "8.3 Design of Sewer": {
        "part 1": "1jL7jfoozHlVnNK_tk5-9PvGSiwkHMN5y",
        "part 2": "1gAFphj4a-6rm3nXyXItoVOoDcbOZnkqv",
        "part 3": "1NCtvG4T5daJs17DZw9z_aaxLY53fgwuy"
      },
      "8.4 Excreta Disposal": {
        "part 1": "1lmrkuOaUJhF2weYjhhxpGAmi0n3LkEEl",
        "part 2": "1q85ZCBYrThM58nqp805PkqrKpDyFl7vL"
      },
      "8.5 Mixed Questions": {
        "part 1": "1DnZSv7TyZYiiZ7c5RBGcnlEYUyFTWOtw"
      },
      "8.6 Original Questions": {
        "Sunil Sah.1-100": "1oCYIwNj8h6SdiOP4bB5HNG3cyX6ZRygd",
        "Sunil Sah.101-200": "1lSJuN-fvaBRsyABUNPApWm09rZn_V0ko",
        "Sunil Sah.201-300": "1aEj_hw63qbOfJsIp1AwnyulTRIQ-e1xh",
        "Sunil Sah.301-400": "1tHiL_rKWaNRHd0y2yphJpElMNKBLDiGq",
        "Sunil Sah.401-500": "1A1Hh0YqmMLsLE7-Ey-9YrYHbRYccE7iZ",
        "Sunil Sah.501-554": "1LnUcKO28KnhVXIerrj003UsrLAiTdUoP"
      }
    },
    "9": {
      "9.1 General": {
        "part 1": "1-h8ucvnyaD83Atn3xt0Bp0iPBlWsV53y",
        "part 2": "1uEv-XlS-mMoR7UzR0bQOzbHbufC2GACG"
      },
      "9.2 Crop Water Requirement": {
        "part 1": "1Yh__Q3cxMy4mo_NOHuR59OVoSgLkLE05",
        "part 2": "1DQXxHsRDSKOI22foZ9YjNc5mHE0YELKc"
      },
      "9.3 Irrigation Canals": {
        "part 1": "1hStyrbKJoVUbUMi8opzZ6We4IzULKF_P",
        "part 2": "1ZOoMzbtO5jzmt-7uq2nIBNzj4st5fTTK",
        "part 3": "1z8j43eNcF5AMJKbwo7OQXKCzQthnpG8q",
        "part 4": "13quzqOk5yqgsBjBMZ6JN17FS23srsebb",
        "part 5": "1pHjmKdz2GMiZwpWYDoc2cSAAcq-6bSnC"
      },
      "9.5 Original Questions": {
        "DPARSAD.1-100": "1SFVGZBZCmcsMlBRLuv3rKjOr-ocKuJTy",
        "DPARSAD.101-200": "1CeQH3i49wF9dc0e6mIznjiSA3A9Qxf3u",
        "DPARSAD.201-300": "1ho8sdNzmE9YHBfUCBWg86ti4oH8w_UxE",
        "DPARSAD.301-376": "1Zg4rlXqtmFgUctS53I_ga_gtj-u3KEPC",
        "DPARSAD.376-408": "1rcHJY4DnOgABTsz1JrrwUlLcfU7VWKhm"
      }
    },
    "10": {
      "10.1 General": {
        "All": "1OMka35SmaeGpiA458-1S5furYkiID2TC"
      },
      "10.2 Geometric Design": {
        "part 1": "185W28R1Fn2_CHdXR80ug7mY16TF2ncKs",
        "part 2": "1_uJW_y_ullxhp8FW3xsZZzcLmUa87mfd",
        "part 3": "1RXy7H3lflHM5OHzq69o-dG9qKGgMvtDB",
        "part 4": "1SjZPSVkrJ-C0eP4zUQNiO6aXInRx7nkC",
        "part 5": "1z5qduTiKt3rvoQnC9cpOfNSj9Lxn2MFs",
        "part 6": "1j00Or-hr5tvBk_nKLaH_RxZK0knVUpPo"
      },
      "10.3 Drainage System": {
        "All": "1lf5_PpCPWDlouaCQbm3pVX8vt_ZU09ho"
      },
      "10.4 Road Pavement": {
        "part 1": "1vAhXvCfhAbdOFCfEv9soPHkgXEaoubkR",
        "part 2": "1DLbrAykrUSZ3ysAlO50-8yI06I9aZ00t"
      },
      "10.6 Road Construction Technology": {
        "All": "12eUtMGxSK-MJ9cvD4H71NnwK_l4L7m76"
      },
      "10.7 Bridge": {
        "All": "1m26_J5rH3gWKWdanOjQETBs_e-WE7-it"
      },
      "10.8 Road Maintenance and Repair": {
        "All": "1ijzv8gQhT4H4Vz_R24jfJXw9bFmrwWSM"
      },
      "10.9 Tracks and Trails": {
        "All": "1ZnmYNh9vIrfyyzEUpnmf1iIee-NroDFx"
      },
      "10.11 Original Questions": {
        "Sunil Sah.1-100": "1oglXPjLqCifewdj8-0MDx-UI5oCVyJ0G",
        "Sunil Sah.101-200": "1DJWlgozHY4-Obn4FAzL4ITZZJIiyCcrD",
        "Sunil Sah.201-300": "1NdciqWDMenHJd9Nl2euJaazASJRkYbtE",
        "Sunil Sah.301-400": "1ZDhz_MWRSrGpOqNXj69-Plkl2RRaja9M",
        "Sunil Sah.401-449": "1KEops4saZRcQGJPtcFAunGue8A392Qwy"
      }
    },
    "11": {
      "11.1 General": {
        "part 1": "1h3Jcu6Kl1owtKGWIcgBi2zyjn1wU-uXT",
        "part 2": "1ASJZvhjU538tuUT-vHll_ebc7C_jSPTY",
        "part 3": "1O9oLBw4NTJVg5FBdTPqzTZ39JMOIgRX_"
      },
      "11.2 Rate Analysis": {
        "All": "1yNmuG9GCPoSqhygfcbVnEQdonne1kYN0"
      },
      "11.3 Specifications": {
        "All": "1ju9BLlX-06vRQGRpkJ91dSNxBLZfMki7"
      },
      "11.4 Valuation": {
        "All": "1BzZsmgaY9X4u7Y5CDbNTWnuq4Hcxfnzr"
      },
      "11.6 Original Questions": {
        "rk.101-183": "193NC9O8OnKkqdC8dXCxjzvB-sYnD49_q",
        "rk.50-100": "1RLHdLWtDPgQnpNDpO4fdRGBHwMI0LLsX",
        "rk.1-50": "1ivzRvvI9ZqXyyin4ncwW-GQIzECHOEDF",
        "Sunil Sah.1-50": "1PatlHpX83cgMO8VH9bbOq6aRoifCNoNW",
        "Sunil Sah.101-150": "1pN1as3DjClVrYhEWBKXXwR2n4Egd4IIc",
        "Sunil Sah.151-200": "1WdqpEn0eSgZzhbT7X5ycF6m57bpRctBZ",
        "Sunil Sah.201-260": "1WmIZf9XFN9CUPxJ9rzwBf6NvE_qrje42",
        "Sunil Sah.261-312": "1wJZMh8dJYUF4Pm-qa80sU0sYMYX8hhKj",
        "Sunil Sah.50-100": "1S82Lnx41zlFQx4-H7bGWW1Zt-I7zCeSx"
      }
    },
    "12": {
      "12.1 Organization": {
        "All": "1ylUYzgEIEhCVQjAUGpl0EAJ4ZqZZk14L"
      },
      "12.2 Site Management": {
        "All": "1HOML4J866rio01fmAeyHPheTQZrvHlyG"
      },
      "12.3 Contract Procedure": {
        "All": "1XFuSx5BelfdgjXqIyCKSoXDqGOMCtfXk"
      },
      "12.4 Accounts": {
        "All": "1fEMSxAzat1oMlCA9z5HWfZEGvk7SW0Jp"
      },
      "12.5 Planning and Control": {
        "All": "1MWvqkY6jLLHu55HOT1fFRmMMaCVXOhHG"
      },
      "12.7 Original Questions": {
        "Sunil Sah.101-200": "1EgH0tKtUJQVmsopLeh61lXTTDzMqbMy6",
        "Sunil Sah.301-348": "10YYfufwvVqTi5XKlSlDQRzeap99HI8Lo",
        "Sunil Sah.201-300": "1ErTJa6lzuCmqtcWMFMH-bwWQnsTPQByU",
        "Sunil Sah.1-100": "1atj3Pt2St3Ag_9Lp1IIKfyFfzyES4jCu"
      }
    },
    "13": {
      "13.1 General": {
        "part 1": "11XuGKeoFUteHz8wc8KDa5fLoLf9xehjc",
        "part 2": "1yqWnCNI0vsHqWr6wctsS7n0Zkqeq0TYm",
        "part 3": "1HulzFbpEZyO7sGPZPYdBQwAWG_BZdjTw",
        "part 4": "1FgSsj4cjr7YZUbE3Vs6OtQFZkoncLPSS"
      },
      "13.2 Design": {
        "part 1": "1q6xMCCRmwhQK4ckcON2dZ-vG37DLInlF",
        "part 2": "1Ka8fwDvKCl7SxLZGlax8nxhAOgELSQ-M"
      },
      "13.3 Airport Maintenance": {
        "All": "1Q6G0kMuCcofVCLp_CMgVdng6zQm9t6-6"
      },
      "13.5 Original Questions": {
        "DPARSAD": "1uxYrB-uf5NSsrjV51lL7hsrvdlDfWP0i",
        "Sunil Sah.1-70": "1W_tOzVueuNMTJEj4Zuwxkk4TxaSyHMm1",
        "Sunil Sah.71-154": "1t8HiHvCUclSdZ_le0PzOe-D5a77xsVpj"
      }
    }
  },
  "level7": {
    "1": {
      "3.1 CG&MOI": {
        "All": "1ZwCGjWNp9JLPz4SwGfmlaZ1dLfv9LFY-"
      },
      "3.2 STRESS&TORSION": {
        "part 1": "1Qwe_ybAXRMpnqXfrkm0BPDRcvKX8Ev1B",
        "part 2": "1DqWRfcNb0U2PT-lNnV0D2DVlezciqbNR",
        "part 3": "1DiLVm5-lebxwf1CjgIZ1zl3ZZmKRG34y",
        "part 4": "1gjFq0qGH0mn3w0-_5lzansPAxJTzDRU9",
        "part 5": "1hN6prbRXHy7Ln1vOJTmENpGNzRt4TFzL"
      },
      "3.3 BEAM&FRAME": {
        "part 1": "10l4qWtb4iaZtPq7luwdiL60GstgJTxmZ",
        "part 2": "13rwsafW0XHsmAic0obW9kKo4iKnOp7xd",
        "part 3": "1lx4TfZrE8Aoe_meIz6tpNi_I8INtFS5X"
      },
      "3.4 DETERMINATE STR": {
        "part 1": "1-nQteCqB7NCshiFm27ounDEWILxiydpw",
        "part 2": "1cTixvcYhE4D4piyDheOESNc7BQ6eZoo5"
      },
      "3.5 INDETERMINATE STR": {
        "part 1": "19CCEDU-fy5uDrEnQqWR_AnnVe48rhAry",
        "part 2": "1rLElFJpuFioKdq9dLmXGiT8freQAjrWG",
        "part 3": "1dUn3ij3cXvb-kioeQ83fp6QKfDaNkK0f"
      },
      "3.6 PLASTIC ANALYSIS": {
        "All": "18aFX4xzESEiV0pveji6-V1ogbKcZ_dtU"
      },
      "3.8 Original Questions": {
        "Dprasad.1-70": "1h3NQ9AL7DSx-5K3uU7XSb9Q7CvPiRwPD",
        "Dprasad.141-228": "1ulh8RD7_hHeBUyrRD95kW_bgyvKQsk51",
        "Dprasad.71-140": "1mgOsZkjGqWZ1AOhu1oQ6ZWtIOA-R3RwS",
        "Sunil Sah": "1pUm2R7pXdID7pjlTvmRlDui7FfltBr0x",
        "Sunil Sah (2)": "1b4NXQw7DeiADVpjEoAfrien4treBAhbF",
        "Sunil Sah (3)": "1bUTZE558TRwHny7bIKVt5O0rDNOfAYUo",
        "Sunil Sah (4)": "1JsK1vTAJ3_hXF6NAHlTE3zLfUgREuTUQ",
        "Sunil Sah (5)": "1XVT97nhyZtu7IjQT8rjLU9hJ-wkntRZF",
        "Sunil Sah (6)": "1Ry7MFLP2WA8K2t59WlqMGb4A5YoDpt6r"
      }
    },
    "2": {
      "4.1 INTRO&CLASSIFICATION": {
        "All": "10mkvFB4fpr0X1BxccsEONwt46cGcqG3k"
      },
      "4.10 CURVES": {
        "part 1": "1lZcMYkmMEYeXDjV6LRf8uZOkseENQ5RA",
        "part 2": "1L6ExptLfwkDGc6Typz3ZhbnAnM9IybB2"
      },
      "4.11 AREA&VOLUME": {
        "All": "1Jzq1O4TWiEMtwJqYVWv8tONtEuqJ8yBL"
      },
      "4.2 LINEAR MEASUREMENT": {
        "part 1": "17laGczYK4ziHMo4e6o8Yioekk2NGgsFl",
        "part 2": "19hdluikk7fnhAzlAptjQP2sCu5OtLCoK",
        "part 3": "1IsaXEvtW9u34tyDcFy1ZLUnIScl_QH79",
        "part 4": "1iDwsZiLwKefgYeQ1RxYr0q8dcqBovNsu"
      },
      "4.3 COMPASS": {
        "part 1": "139hnd8mqB5cj6Rg6fC0WGvKFV5QV3IRu",
        "part 2": "1DjRvlCsttx7nxiX7eBr72YTdqMn1FZHT",
        "part 3": "1UTk4VaTicoDLD9Th6mHJcLiX-KisCdfF"
      },
      "4.4 PLANE TABLE": {
        "part 1": "1kc4q6cZ3_wB5IhDhue67gjncPABUYT90",
        "part 2": "1BCCLK-zchdZP3SYOp14rW3E_p2zf5HIc"
      },
      "4.5 LEVELING": {
        "part 1": "10_3SHAtpt6K3jM_X-1334EVn7ajA3Fkw",
        "part 2": "1KwkjaePwIp_9uYjDUCMUZo7KPJlv8RXd",
        "part 3": "1k1RlDwZzfvpnbuGgbcDa1tnv-kdGYjhf",
        "part 4": "1mjmLp8xFDH3fgcormuVtPVhtGnMvNpXL",
        "part 5": "1b9xJInrKkDruXgtNKszoPHnLIQ9Qoy7L",
        "part 6": "19xdlLNqj5YdyTr9jNVKbpbjnbSLt9PTv"
      },
      "4.6 CONTOURING": {
        "part 1": "1fZyNCBB7yRT85sFaWQysXAiOdt_D4o0C",
        "part 2": "1LGfcifMzJNNo-tDGLFnkUwSr2Q3-rDwl"
      },
      "4.7 THEODOLITE TRAVERSE": {
        "part 1": "1VCjGrE29TK9NVSf9OdyJ_Nt06ARAOy8M",
        "part 2": "1f5wLOsyqWtLsAnPLo-txyDVLcOZZXt2Z",
        "part 3": "1fwUAK2F10OO28M3e17x-jFvS41KQp6oE"
      },
      "4.8 TACHEOMETRY": {
        "All": "1mBsNppNmpKjWF75JfdaI7Z7d1jJNcgs3"
      },
      "4.9 TOTAL STATION": {
        "All": "1ipxIEvTPBRYGcP5vC3ckCwOB_T0jiT6J"
      },
      "4.13 Original Questions": {
        "Dprasad.350-455": "1K1C4cyYliqsH84pwlxrBmux8HNUtv9Ra",
        "Dprasad.1-100": "1yXZHd56UGxIi5RGl4XA-600dDaq8PpDR",
        "Dprasad.101-175": "14zRkZBGZnFXkxGylMqplHxDgq53CWayc",
        "Dprasad.175-250": "1TzBMpOzm-Qp5-yqB5T7y7J3cS06Kt8vs",
        "Dprasad.251-350": "1jw4nzypzxqQo7xO9JcRUUtyVL1U6kbDq",
        "RK SHRESTHA.1-77": "1oGLIdes_EzZHxP43jZ_hyge25tTnJJ87",
        "RK SHRESTHA.78-154": "1Iu7aiQBT7gl1B1iZQuRe0uROkct5ILqM",
        "RK SHRESTHA.155-231": "1qZwLo-rZKd20FsDMy3fIcuoYp5EX8C4y",
        "RK SHRESTHA.232-307": "1Qgrqpg5fspGgqKqgQ7adsCy3id1EVAbw",
        "Sunil Sah.301-400": "1osqnpEHMXIrvG-6ST9oUE4gSPtr6G_Hc",
        "Sunil Sah.401-500": "10odoecJBc0CH-H38StLo39hehJjaFnCD",
        "Sunil Sah.501-575": "1cnh4Hc01fgg7rg7ZwV0m73ETPzMSIjKo",
        "Sunil Sah.1-100": "1lCbZRMeQffvy9pwGuh3EEqogDR_SxK5n",
        "Sunil Sah.101-200": "1YalAurSQ86pTPsHJ5ofTmvrCMz9XVOQ3",
        "Sunil Sah.201-300": "17SwMITW5Bch3XqUkApLeQlLxN-sCeUnq"
      }
    },
    "3": {
      "5.1 MATERIAL PROPERTIES": {
        "All": "1oUVyWipdGSAHRd7cLdQv5PWW4stj4Rkh"
      },
      "5.2 STONES": {
        "part 1": "1B3_nVN95sbZKAmbTwZLMuFgefBbeLZfQ",
        "part 2": "1rIligq5uX8jEwfpf-zjuu6QI8_SYJTsG",
        "part 3": "1LQcd36TtFP4wwFPUrF5qhKLtiZPfeRnE",
        "part 4": "1vl1eR0DGc_Lb09y9UskbsAZzS_hRLn4m"
      },
      "5.3 CERAMIC MATERIALS": {
        "part 1": "1Twr4hE-lB60jR1BPDV7UA7vq_pnS4tNU",
        "part 2": "1pK4VrWta_AA30GXyRzQmJP57TlbSnVhf",
        "part 3": "1hcTfUxzJ-R6_sN-yUaGHvxPu6Iz5myPM"
      },
      "5.4 CEMENTING MATERIALS": {
        "part 1": "1_ZB4JnhQtQMplNdQ9vmUBVhEvfuyH5qZ",
        "part 2": "1StgnmDWLvH_enHtIge4eNbgE24EO7UwL",
        "part 3": "1meZrLYr70sy1LWjBXVu0u_jhaQMkrpYc",
        "part 4": "1NFfBAkyMsD4dl-dOVU31QjgzsEYWL8wI",
        "part 5": "1ikqLDsIcjd7k5O7deFeqClAf76nqjiu8"
      },
      "5.5 METALS": {
        "part 1": "1sWW3F_nbz1KqxVKb7-snf0HFgWzzQPD3",
        "part 2": "1RLKNSH65Z0m3IsMM93nXs_zBGe3J6n0m"
      },
      "5.6 TIMBER&WOOD": {
        "part 1": "1_Chd6EB0-IosuoosDQvuHgbHWUfjz_HE",
        "part 2": "1n_oej3A0khCRkawJIv5yUnmKnsz9bS3G"
      },
      "5.7 MISC MATERIALS": {
        "part 1": "1PGVsA6wLWtGugwBr85FOVUO9nwjIWkoQ",
        "part 2": "1qhMqWyIBwHfHU1kUtXUI4YwaSdBwWPC8",
        "part 3": "1CQySCgrkVux6uvYujHHaFt0-5Eeol-xn",
        "part 4": "1vti9CIW63IX2K_r0D3MJJ32NqPlZKZhY"
      },
      "5.8 SOIL PROPERTIES": {
        "All": "1Mm0Ise5UhDXZV_bvBq9SyERHDSLjicja"
      },
      "5.9 LOCAL&MODERN MAT": {
        "All": "11_FwFHuLjDh1AnFzPmM0kFderY-N1kcY"
      },
      "5.11 Original Questions": {
        "Dprasad.255-350": "1Z-kyfriVVY8ROCOK7_jrzVg2SuL2xP29",
        "Dprasad.101-175": "1xXcFMVIymWnuTOJF-nh9SSJzuXNQYfWr",
        "Dprasad.176-255": "1-XkoaqH9T6hRKec8j-dfuJwPKQDKYpFt",
        "Dprasad.1-100": "1v1LXYwzNF2TafCQKunBOrxl_UHn8W7NO",
        "Dprasad.351-447": "1jTaYfKLulzd7heCGJc4BLR5kaaQA0mX2",
        "RK SHRESTHA.1-75": "149Jiv13N8z5n2UdmhfE8RaXnGiQPz21z",
        "RK SHRESTHA.151-225": "1MKSdWQ_63uRElC6Zlr4cMIru1csvwEdQ",
        "RK SHRESTHA.226-300": "1rDmevr2rOcf894F7agAPNtN_ku6i8HWU",
        "RK SHRESTHA.301-375": "1GuCW5aF4k2IMHGOJoKKUDw4vvAGb8THc",
        "RK SHRESTHA.76-150": "1QW_IbwgQyEyfqVeDezET5dZHRqb1fMDq",
        "Sunil Sah.141-210": "1tDED4cgsRoGV_np8zUqQY4Q1Gsf_xmM9",
        "Sunil Sah.1-70": "1rma0ZhSKahdUPmh3W4sOdl7RtBLAd_5o",
        "Sunil Sah.211-280": "1Nvc5UgqjQhZXlL-poRll6y5ABXIdJk2y",
        "Sunil Sah.71-140": "1JHjVg0pJC7bFaJTV_YBrNYo-fvkj826-"
      }
    },
    "4": {
      "6.1 CONCRETE CONSTITUENTS": {
        "part 1": "1B2cYs-w49OIJqYQHhIDqn4SPhWspYdBo",
        "part 2": "1wmpsylkgEVYNViUnVJ9OWPfG00gFF9c4",
        "part 3": "1G_UAT6Q1_BHqfvS6iHxOchkwliw_A3Tz",
        "part 4": "1cJXy3fKvF7WCNNL61o748PPIC6TDhDul",
        "part 5": "1cjb9xJqqxH_R9sSrV_rs8_v-5C-CuZkD",
        "part 6": "1lztOV8Su3kz74g4qY4qdOEjGg_zi_XgR",
        "part 7": "1P6eDZr9QhKbMIV3QhVZVd9J8OIR31Ocz"
      },
      "6.2 W-C RATIO": {
        "part 1": "19sXit5PuZ8udc3-uP6q2XuR7bUCEJbAb",
        "part 2": "17jHcSxDQl24kkGU-gG_uN3QqktHGjj3e",
        "part 3": "14Fn1bhJ9nlFyt2WuTvqPY5L7i4yvDQu9"
      },
      "6.3 GRADE&MIX DESIGN": {
        "part 1": "19dNm5jrvCh5uFBjRj4HWg-c9NmutdpdI",
        "part 2": "1EfICiOmHHcMzEWw-Ek3A2YafpLpEtApm",
        "part 3": "1igh5UELiAIgKEVq7-VOIGJxxc1Vyg1A9"
      },
      "6.4 MIXING&CURING": {
        "part 1": "1FPai3Eei-PBuGRYHZGF3lWHqRDwOdqgS",
        "part 2": "1zzgzWTVTNcBThaLad649d1n-8FKayUlR",
        "part 3": "171W7djufwa7CdxI4owUyXs2VjLXPVje4"
      },
      "6.5 ADMIXTURES": {
        "All": "1j0wqxd2JkB1t41D6Y2sYCD2Ft3400WYP"
      },
      "6.6 HIGH STRENGTH CONC": {
        "All": "1gYZRAwbNu6yPmGu7DVaJeL-CbTtFnyMI"
      },
      "6.7 PRESTRESSED CONC (sorted)": {
        "All": "1QcWlvMJ2P8Ky-Ihkjvd0fh8P_FgtC16z"
      },
      "6.8 Mixed Questions": {
        "part 1": "1Mv-XpoHhMlsPiXesyyIJvqZVhmvyHcZP"
      },
      "6.9 Original Questions": {
        "Dprasad.201-250": "1hAP5zyfL5MaK1EqS_J-ZSWQXAX3J0UOB",
        "Dprasad.250-300": "1sRb5evs5CLiK0xDn6wHP0qQmi2sY8f4s",
        "Dprasad.301-350": "1Bug0gYU7UcILpX9je5xtgfWfHZIEN4W6",
        "Dprasad.350-405": "1UoQ5GoTD_ggx9AJqAaqYgfLARb10pqOp",
        "Dprasad.1-50": "1jhAs_3b61Cn6YjY45hHqwO2ceJuygbr_",
        "Dprasad.101-150": "13T28p8WnYFPqNguu_4YsRnFJ5zOlaQ5B",
        "Dprasad.151-200": "1OjdrC5yQ4x8jTijTNm6VmOWG5bqoBpQ5",
        "Dprasad.50-100": "11UWRoG-JKMxE28HF44iUGYidJ46XIi17",
        "RK SHRESTHA.1-80": "1ogn7X2qg57YbNVu_ExzsW4aas-8TKEU_",
        "RK SHRESTHA.161-240": "1GgimqtgDGbUjdXAVP6J4KXdfEx5NcFhF",
        "RK SHRESTHA.81-160": "1EaAqgiwXjaXsiwP9NBB2Vn07RhIBfPTZ",
        "Sunil Sah.1-60": "1DLBtX2nbBATwSVeUJaQNi9FN_h-aFbLo",
        "Sunil Sah.121-180": "1MVOgyr-fu4YAZBbMNUte8PqEkizOgVAW",
        "Sunil Sah.181-250": "1LbmUSXov8iOfpRJ4pMUA1S5O-C8whiPo",
        "Sunil Sah.251-320": "1Ma8TqS4fANNB-veqHuoe-hXUwnclra9u",
        "Sunil Sah.321-371": "1146n9IrGrM1IVaJFZDu-b2svyWA3UA1I",
        "Sunil Sah.61-120": "1ANmZTUYM5Mf_eH3z6xsFT8CagtLOF5NC"
      }
    },
    "5": {
      "7.1 SOIL FORMATION": {
        "part 1": "1Y7G-Rxui20fWY5EsCrfv60ogMywRRpKX",
        "part 2": "1Ot2uOZNflTQ2Zh9ozJF5CWB7ziNDg9P8"
      },
      "7.2 3-PHASE SOIL": {
        "part 1": "1CzPL0leEiNWZaSWpsAiXRcDT9gGv3SM7",
        "part 2": "10wW1N6vRv8NxO1viKM-ADHJrkbvJZ-oX",
        "part 3": "1jNO2i6zYhULXqbAQ0yqV-Bmz8Kh5HuUc"
      },
      "7.3 WATER IN SOIL": {
        "part 1": "1Q9QDJYRR9AvBMtdBuJ9bELvFDvY7NBwn",
        "part 2": "1O9cORPTe7u14xR103V3mH9mriRnnh4KU",
        "part 3": "1m6ZORCOtHN0e7Phxjtu-iwGpqL9sovZT",
        "part 4": "1tlfl7fB04DVkTncHyJjSr-_3pgmwEwAd",
        "part 5": "1L0_rizQlMZlFVsqKrJ7lInpkwMRaGwpr"
      },
      "7.4 INDEX PROPERTIES": {
        "part 1": "1lHuLlBjztjZ6RCrhzBUmjwZ_QgFyTDmP",
        "part 2": "1I8RLiCA-YMvh0DzIGPBVi95dhgnilZQd",
        "part 3": "17sgH-D1Q5xM9N1z6YVGDxWam_Slf-nvv",
        "part 4": "1HaTM_3pXlOZ4-_tf6MZxw_eVp0TGBgB6"
      },
      "7.5 ROCK&EARTHQUAKE": {
        "All": "1yrZc0ZaRXWYSYQIt5jUV0_M5YhO_ImUz"
      },
      "7.6 TUNNELING": {
        "part 1": "1JV6jAfhjbyKe3UTS_BU12zaTtNg1tZpC",
        "part 2": "1Eu7Okzxugy0MAGhyvkdcsSiIdtKv9dRq"
      },
      "7.8 Original Questions": {
        "DPARSAD": "1ipRrpTWBA7JIdwCuTY73ZZwY0CTM-LAP",
        "RK SHRESTHA.1-69": "1AJlI1Dsf1vugz-e76IOnrLcDUi8ANSvv",
        "RK SHRESTHA.139-207": "1E4vRDqK86c23Ki-reszLKuMIg5-QUsEU",
        "RK SHRESTHA.208-276": "17E7qw-1-Q3cIy8e6Gt76WdDlC-gQsubc",
        "RK SHRESTHA.70-138": "1a5xfPk5LFN8t5C5MSlFupxUw2zf9rGS8",
        "Sunil Sah.1-65": "1ROkwWR58iXj4fHUpBXFEojKqQeB2CAt0",
        "Sunil Sah.66-130": "1hJ21NNiTLocUDO_Fom2CPwHMb6yI80sO",
        "Sunil Sah.131-195": "1TEnCQJjp8bXDSKhbeRfkUpRQyY3JWB43",
        "Sunil Sah.196-260": "1jW-DAK3TOQifU-xL3kadYcrXUdZLV-MO",
        "Sunil Sah.261-325": "18YGtECCnoJuGW54Q4mxyOYdayTiglb0i",
        "Sunil Sah.326-390": "1Q3eLI8NFamlw2kEPXp8jZV_I8OHT8Ys3",
        "Sunil Sah.391-453": "1lv6ra_GUsnq4Wtza6r4RnT-YdP3UgVOk"
      }
    },
    "6": {
      "8.1 SCHEDULING&PLANNING": {
        "part 1": "18a6jBOCtIIyJ9i2BeX_qUIXqPZa7Xkbf",
        "part 2": "1A_6LNU8xC3yxKWof9VnQ0YlKgVDBwNJn",
        "part 3": "1tfxtmjQcYokjfeCz4vzubN7u2zKLHZsy",
        "part 4": "1bjHpRTOt30Cw2miIDuZ90JbB4mxFMBxF",
        "part 5": "1V5Sw3rYygotvrOAGIoEZ7M9d1e55VXDf",
        "part 6": "17M5vFch3AOeYwpNxiWodBwnhh-hMsrTd",
        "part 7": "1SATBk_JKy3tMcqA7gOvh1Phr95AYMnrR",
        "part 8": "1dKvnof7q_XXN6qwGk06C4ObCZZ-6tlDX",
        "part 9": "1sgJV5zTA_3HhCeW6b_SNpZ-jkJQyJUsX"
      },
      "8.2 CONTRACTUAL PROCEDURE": {
        "part 1": "1afwPWNILUE7LN7yGt_I4EBdMXciKvKoK",
        "part 2": "1hMBIreFaitVQ-5bg9ELPPv8-nODfaOkF",
        "part 3": "1JeL_JRhRYxHjqVPrKltDP38nRhWAcYMA"
      },
      "8.3 MATERIAL MGMT": {
        "part 1": "1bF6HjON7GczZsCtV0nmqSHwHY8RIuDdr",
        "part 2": "1R5whj_ZEBq8PBEs55EZbj7VSRG9wwL5Y"
      },
      "8.4 COST QUALITY TIME": {
        "part 1": "14lCiXpAMsErq44WNW40D1etQG2Bmzzc4",
        "part 2": "1KWGXJpDceEhP1bPgdfvcMaDituEYdVxT"
      },
      "8.5 PROJECT MGMT": {
        "part 1": "1Bd-LXw0U4SZXQ293PciuJGaFJ0ZxARoN",
        "part 2": "1W5_F0DwFFCLsnpBYf-pOfvjt3oI7nixG"
      },
      "8.6 HEALTH&SAFETY": {
        "All": "1lMwIk6BjsyDgBF6mWbGoRsR1uPhcbwNs"
      },
      "8.7 MONITORING&EVAL": {
        "All": "1o7iKCS3w-0Qf24cLXZM21oq0lz2ZSFCw"
      },
      "8.8 QA PLAN": {
        "All": "1-fEOsNumGUnf3tWqof_zVTXkJcBYC-gj"
      },
      "8.9 VARIATION&ALTERATION": {
        "All": "1igAjH_reAaNeQunCU3T2joEPPCj11R0c"
      },
      "8.11 Original Questions": {
        "D parsad old book.150-200": "18HnjG1-leT6OXk5mYPGTJluMw2yiFUEy",
        "D parsad old book.100-150": "1KY9GTqB8sTJpGha_JnYYE9Pvnnzotf9h",
        "D parsad old book.200-205": "1KA-3P2cmmQKQRmr_-UU74ik_MmNsJ8F2",
        "D parsad old book.1-100": "1IYG4gFrvXBJ8n2kJRFL1UCRZdUOZsZCv",
        "D parsad old book.50-100": "1981sMj5WNTZeKsghbz4N_eEqqxm1XbT5",
        "D prasad New Book.1-75": "1cQGpQHGzekcDnE2duOkYzx3NAoeuPv5h",
        "D prasad New Book.151-225": "1tro7AirSkoOm9zYvJyQo5W_hlUvoqvlg",
        "D prasad New Book.226-310": "12jhiq9Jbp3EwvqJgW_bxyPq77IYfUEAa",
        "D prasad New Book.75-150": "1T2tghXwm_6Dqy5FkQgs0wiRrhl0NQuGM",
        "RK SHRESTHA": "1_KH4l09hI0GeH6J5tGd6vGCQZzNjj7_J",
        "RK SHRESTHA (2)": "1V9EtSiGB2_jaOpTdna_0VGt6iSVh6WmG",
        "RK SHRESTHA (3)": "1vdN4MvatiJJ-7Qjz4epjV6FluEVf5a-m",
        "RK SHRESTHA (4)": "1nz3Tvjl6THGuXYKTnXLH8ZbYKxyfRy-w",
        "RK SHRESTHA (5)": "1CJfsghP6UOy5qv29ktUrhhNBhqnmqRj7",
        "Sunil Sah.1-70": "1FcnYFp5Btd5DD7YWt4DCYxFE8zwZqWOE",
        "Sunil Sah.141-210": "1npFC-VYk3oPqV_1uF7fqFadATr82rqGJ",
        "Sunil Sah.211-280": "1pZZBRkKnm6KgrJXg8xLeO2c2RRYesPsO",
        "Sunil Sah.281-335": "1BRnvmWt5eDa5yUsdLaWQXspp94oHMMg3",
        "Sunil Sah.71-140": "1fsK7-1vvlXEqvuCXdo78sMX_BBSKtf0f"
      }
    },
    "7": {
      "9.1 TYPES OF ESTIMATES": {
        "part 1": "1GL-OrY_6w1rViUTHZTCBHXK6F83-T_PP",
        "part 2": "1jx_Aoq8qUXUxLsBkcnW5DaQfQpHhLuev"
      },
      "9.2 QUANTITY CALC": {
        "part 1": "1DrK50iZPDNitkMp2uPY83Zz1p5t-9s8x",
        "part 2": "1VE334vBEwNGokxNMYEwRmXObwwYhFsnn",
        "part 3": "1bJJ3z3e2UaFAmfJkd1kbxdcYNPpYXrTj",
        "part 4": "1hiCeQk1FUxQPc0gLuFH0a3fgJm2Gg7kV",
        "part 5": "137d1y3YUfZGbOXbO0_jN375gAZOkeDKr",
        "part 6": "1gJnBsKVE1HjtZ2GrwBuLeqCo2pJBqx-4"
      },
      "9.3 RATE ANALYSIS": {
        "part 1": "1ldYLDOOABx_eu6qDAV_u1GbPsoZap5dV",
        "part 2": "1L1hXxBGF9i2_yOSgz2OKP9vCyWUm_46J"
      },
      "9.4 BOQ": {
        "part 1": "1JfHM6mMMgHhvpM3Jm1tV9kRLe3hhnP1T",
        "part 2": "1lxMjIGicUbFxKgipwQMUXG85Lpup_smb"
      },
      "9.5 SPECIFICATION": {
        "part 1": "1P05x3n-GhJbF2BxQYndrZX61Ge2psUbE",
        "part 2": "1qiwmghmPTFJeCSTQi2lOMUDSmcSSGKAD"
      },
      "9.6 VALUATION": {
        "part 1": "1bLjJ-Ku_yIhWMJPbTF_onn_0fpstKgRA",
        "part 2": "10sFr1YY7mVcA31sNg9qkGqOXi-yYq1Vw"
      },
      "9.7 Mixed Questions": {
        "part 1": "1EVK0QZhvQX2w2b58WDgCiEg49uqWdndR"
      },
      "9.8 Original Questions": {
        "Dprasad.1-50": "1WR0c-cQrD6ZNrpW31pgFTrhekyT_0n4K",
        "Dprasad.101-151": "1O3bhzDvGZfUTy1T9guFuq_aAn3PAq7Xi",
        "Dprasad.151-200": "1E22sJNC6miJwVNDD5cz8EW3OXTWKc4XT",
        "Dprasad.201-250": "1-VeNFb81ynETihERKfWNUOZSqrYopyOH",
        "Dprasad.51-100": "1RjkK83GYpLncIqJJ2FGYkHh0FGGksJ_J",
        "RK SHRESTHA.1-81": "1x38YE2cp5xh0HDOS4MxJ4lvPqu3BdGdc",
        "RK SHRESTHA.82-162": "1XNc9kD0zGUJ1x3c-0wmL71XalNg46W42",
        "RK SHRESTHA.163-242": "1_QL2BkJ0KasZes4mlPqRdxygRCctGMS5",
        "Sunil Sah.1-60": "1gy-w5Blxv6apj-J3I3TweN1_x-Z_QEOO",
        "Sunil Sah.61-120": "1Vu83clEgZ5HYPt9u0X1RwBrnaBYQ6f-d",
        "Sunil Sah.121-180": "1psouu17RetzwmZAOAX0SDeIdbf5rPmYj",
        "Sunil Sah.181-240": "18zaqow3ZotVGbTkXJCorTxVl5ig1lUYw",
        "Sunil Sah.241-300": "1WsHj12btBEVatQvdgW3k75pnGc7LL1EY",
        "Sunil Sah.301-311": "1im9kZ4Ozp7UdWmOi9mU-WaQBA4f2jxqJ"
      }
    },
    "8": {
      "10.1 DRAWING SHEET": {
        "part 1": "1-88kvrCm3cP0W_fSqo6D578671EwbqDk",
        "part 2": "1a-0Eu9vnxgiIUoeHfbVPU3SRBVwnyG-f"
      },
      "10.2 SCALES&SITE PLANS": {
        "part 1": "1Qyqb0rzPmCrudvKh7Y3ndAWNIDRvlQ2t",
        "part 2": "1-pcFrQtnmb9wHQrhDyE5uBukTsvRVUby"
      },
      "10.3 PROJECTION THEORY": {
        "part 1": "1Ql5TRnvh9OeiRsogqz86vH9sc0KiCQQe",
        "part 2": "1XTdsMcO6tW778V_ApuPcdM5zwX0ZLmJj",
        "part 3": "1uO0s_vMaRiUqU3zEHIOSUKzaA6tfZ5XC",
        "part 4": "18a7HwfV2EvYPuav8qHXA2hqvAdjJgNG-",
        "part 5": "1XgMnKwFM3zk5MxWgRfNpnkZvEll_K2GQ"
      },
      "10.4 DRAFTING TOOLS": {
        "part 1": "1egviWDC9Q83dzwUjalVNqSeloRu-oT41",
        "part 2": "15RSsZ68AMtYoGcKad5hpwI-DIkJZc6fd"
      },
      "10.5 DRAFTING CONVENTIONS": {
        "part 1": "1TaUMyjiSm4gOP3KbIaG5SnTs0xG3w16-",
        "part 2": "1YOmgqOQ9BZsNy-R0Url3wd1AGam2yBp1"
      },
      "10.6 TOPO&SERVICE DWG": {
        "All": "1B4El9s4hyjn2Z0A-9Gjm-1cc0duXTJD-"
      },
      "10.7 FREEHAND DRAWING": {
        "All": "1dzM1MWyNulb7bjPLM5rbqGavY-Jeq31s"
      },
      "10.9 Original Questions": {
        "Dprasad.1-100": "1WqQPC_gqQ8gM43tMEatrpvFb91Rzfb5k",
        "Dprasad.101-183": "1AXIlR6OKS9cG65HU5xZvyJWeNj6-MJk1",
        "RK SHRESTHA.1-71": "172V_845Zdr84U69dr0bmMDbxz56Ya74M",
        "RK SHRESTHA.143-213": "1EvRKn9B2I8jjT1UeWzB8IYiDKRhz0NSs",
        "RK SHRESTHA.72-142": "1YrxxoZ0IPON3ycUL0sa8sjiRHEtKip5r",
        "Sunil Sah.1-60": "1NGdcUY61BDfDqniZwKxqNDIWEW8ZDHGf",
        "Sunil Sah.61-120": "1nJjubNOB9ZPePWk7wF77N74KBTIUl9xI",
        "Sunil Sah.121-180": "1-TuAjR91JnP3V8MELsh4g_h4fyMR8f8U",
        "Sunil Sah.181-240": "1iAruFIxOWf04iXxO3Ib4V4ngdk8EOd5r",
        "Sunil Sah.241-300": "1Qn57XzooYN2TWpjrE-jVrNas_9Pifft5",
        "Sunil Sah.301-338": "1z1G-5c8Jg7afH5oRE7oD65dp-SHKPDFI"
      }
    },
    "9": {
      "11.1 INTEREST&TIME VALUE": {
        "All": "1xZ_JQsl6YPLdtWdZecVxrPKu4Am4b6_n"
      },
      "11.2 ANNUITIES&SINKING FUND": {
        "All": "1FZgN_IgHtwBFVKqMb0TRoCTk7LiDbTku"
      },
      "11.3 NPV IRR WORTH METHODS": {
        "part 1": "1MuTKFIQuIIPb-AJ86ZxTB-grlgR-oY27",
        "part 2": "1gbe96NqgioD9JxidmSOE959ztIjD9zbV"
      },
      "11.4 COST CONCEPTS": {
        "part 1": "1_vzRvcF_k88FO05trH7wVSoyhqAqBP0L",
        "part 2": "1ybU-6G_Wr_f78A9_HjE1bS0_4UYQDyEh"
      },
      "11.5 BREAKEVEN&SENSITIVITY": {
        "All": "1_3-effRqPD919adpJQMNoHkqcYTq1_oO"
      },
      "11.6 ECONOMICS BASICS": {
        "part 1": "1GnmkUkyHlPe5lHTnYcdV-Wjre5TonaLm",
        "part 2": "1sPjxu16AAuId2FQGGhQYICGPxpbvnKkp"
      },
      "11.8 Original Questions": {
        "Dprasad.1-75": "1vzp6vp3jscMoDEsNwLTAdX6fw2qoOe55",
        "Dprasad": "1abshceD1-c5wygd9L32gAoLpuYdBqkd8",
        "RK SHRESTHA.1-54": "1OJYDYMCCYbayimPJzRlf7ZNI3C48YJIw",
        "RK SHRESTHA.55-108": "1VBxr0CbRm7LYah9FBTC3Cnl2-ddyIV39",
        "Sunil Sah.1-73": "1aRxux9NDAvRNxN_nqM4Gv6QilYG5ZwVD",
        "Sunil Sah.74-146": "1jCxxpPxi2GrHsCkbtEEHrm-slHJ6lzpI"
      }
    },
    "10": {
      "12.1 ETHICS&INTEGRITY": {
        "part 1": "1p1D7LV8eqUGymR3WqjRCDEGSo2WDREg5",
        "part 2": "1zsiY6D28oW_v9B2u7jiQNd3ZUnc5BFi9"
      },
      "12.2 NEC ACT": {
        "part 1": "1sJyBUquLArs7MQboAc_Paab_qQm9AI-5",
        "part 2": "1egmE0i3mLZ1kn7KqkOBlxHUWe8oxJrOn",
        "part 3": "1qii5YZphVYRC0GRiFv0p87zKyPwNcjHq"
      },
      "12.3 CLIENT&CONTRACTOR REL": {
        "All": "1xNlCt6LVPyiTZI6wHmAPjFw1v-TwFnvc"
      },
      "12.4 PUBLIC PROCUREMENT": {
        "part 1": "1Wo55grBxctJc2TbNi5KWbGg58QlZ8kB5",
        "part 2": "1amK-0DE4dbkf3Qa5duWLb7t2oXoxciBM",
        "part 3": "1Mfa99wJI7XW40c61MFEbKjoOKrIJDiah"
      },
      "12.5 NBC": {
        "All": "1nbC_l-hj6VJ3ygsf-FoWzmztGA5-MUC6"
      },
      "12.6 BUILDING BYLAWS": {
        "All": "11vPa9pcax1Sx2qb-xfKoXEcX5chP1eGo"
      },
      "12.8 Original Questions": {
        "Dprasad": "16Yw0SALw-Vk1KR-7HnRZdetJFqarj7S2",
        "RK SHRESTHA": "1TsbaxhfnQdqsR31Qc0m48q3aIO2rqHfy",
        "RK SHRESTHA (2)": "1hTK4XCovy30ZCZ5j5AmCOcTdfQCYLsTq",
        "SunilSah.1-60": "1j8Qy9YyM7s-1w-qfyqoDzpXia1gumgaq",
        "SunilSah.61-120": "1bzgiKA9qYcxqkYdKT0lJzvlra6XWe0oE"
      }
    }
  }
};

/* ----------------------------------------------------------------------
   CHAPTERDATA -- accessor API used by app.js / objective.js / admin.html.
   Signatures unchanged from the previous version.
   ---------------------------------------------------------------------- */
(function(){
'use strict';

function _levels(){ return Object.keys(LEVEL_LABELS); }
function levelLabel(lv){ return LEVEL_LABELS[lv] || lv; }
function chapters(lv){ return CH_NAMES[lv] || {}; }
function chapterName(lv, ch){
  return (CH_NAMES[lv] && CH_NAMES[lv][String(ch)]) || `Chapter ${ch}`;
}
function books(lv, ch){
  return (DRIVE[lv] && DRIVE[lv][String(ch)]) || {};
}
function files(lv, ch, sub){
  return books(lv, ch)[sub] || {};
}

function chapterFileRefs(lv, ch){
  const out     = [];
  const chSubs  = books(lv, ch);
  const chLabel = chapterName(lv, ch);
  Object.keys(chSubs).forEach(subLabel => {
    const fm = chSubs[subLabel] || {};
    Object.keys(fm).forEach(fileLabel => {
      const fid = fm[fileLabel];
      if (!fid) return;
      out.push({
        lv:       String(lv),
        ch:       String(ch),
        book:     subLabel,
        subtopic: fileLabel,
        fid:      String(fid),
        key:      `${lv}_${ch}_${subLabel}_${fileLabel}`,
        name:     `${chLabel} -- ${subLabel} -- ${fileLabel}`
      });
    });
  });
  return out;
}

function allFileRefs(){
  const out = [];
  _levels().forEach(lv => {
    Object.keys(CH_NAMES[lv] || {}).forEach(ch => {
      out.push(...chapterFileRefs(lv, ch));
    });
  });
  return out;
}

function fileCount(lv, ch, sub){
  if (!lv){
    let t = 0;
    _levels().forEach(l => {
      Object.keys(CH_NAMES[l] || {}).forEach(c => {
        t += chapterFileRefs(l, c).length;
      });
    });
    return t;
  }
  if (!ch){
    let t = 0;
    Object.keys(CH_NAMES[lv] || {}).forEach(c => {
      t += chapterFileRefs(lv, c).length;
    });
    return t;
  }
  if (!sub) return chapterFileRefs(lv, ch).length;
  return Object.values(files(lv, ch, sub) || {}).filter(Boolean).length;
}

if (typeof window !== 'undefined') {
  window.CH_NAMES      = CH_NAMES;
  window.LEVEL_LABELS  = LEVEL_LABELS;
  window.DRIVE         = DRIVE;
  window.ChapterData = {
    levels: _levels, levelLabel, chapters, chapterName,
    books, files, chapterFileRefs, allFileRefs, fileCount
  };
}
})();
