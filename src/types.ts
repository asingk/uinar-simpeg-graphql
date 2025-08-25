import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { PegawaiModel, StrukturJabatanModel, StrukturLevelJabatanModel, LevelJabatanModel, StrukturOrganisasiModel, JabatanLevelModel, FakultasModel, DosenModel, ProdiJabatanDosenModel, UnitKerjaPegawaiModel } from './models/simpeg-db';
import { Context } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type Alamat = {
  __typename?: 'Alamat';
  deskripsi?: Maybe<Scalars['String']['output']>;
  kabKota?: Maybe<Scalars['String']['output']>;
  kodePos?: Maybe<Scalars['String']['output']>;
  provinsi?: Maybe<Scalars['String']['output']>;
};

export type BagianUnitKerja = {
  __typename?: 'BagianUnitKerja';
  id: Scalars['String']['output'];
  nama: Scalars['String']['output'];
};

export type CreatePegawaiNotSyncInput = {
  gelarBelakang?: InputMaybe<Scalars['String']['input']>;
  gelarDepan?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
  password: Scalars['String']['input'];
  prodiId?: InputMaybe<Scalars['String']['input']>;
  statusPegawaiId: Scalars['Int']['input'];
  strukturJabatanId: Scalars['ID']['input'];
  strukturOrganisasiId?: InputMaybe<Scalars['ID']['input']>;
  unitGajiId: Scalars['ID']['input'];
  unitRemunId: Scalars['ID']['input'];
};

export type CreatePegawaiSyncInput = {
  id: Scalars['ID']['input'];
  password: Scalars['String']['input'];
  prodiId?: InputMaybe<Scalars['String']['input']>;
  strukturJabatanId: Scalars['ID']['input'];
  strukturOrganisasiId?: InputMaybe<Scalars['ID']['input']>;
  unitGajiId: Scalars['ID']['input'];
  unitRemunId: Scalars['ID']['input'];
};

export type CreateStrukturJabatanInput = {
  grade?: InputMaybe<Scalars['String']['input']>;
  levelId: Scalars['String']['input'];
  sublevelId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStrukturOrganisasiInput = {
  bagianId?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  posisiId: Scalars['String']['input'];
  subbagId?: InputMaybe<Scalars['String']['input']>;
  unitKerjaId?: InputMaybe<Scalars['String']['input']>;
};

export type DaftarPegawaiResponse = {
  __typename?: 'DaftarPegawaiResponse';
  count: Scalars['Int']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  pegawai?: Maybe<Array<Pegawai>>;
};

export type Dosen = {
  __typename?: 'Dosen';
  gsId?: Maybe<Scalars['String']['output']>;
  nidn?: Maybe<Scalars['String']['output']>;
  orcidId?: Maybe<Scalars['String']['output']>;
  prodi?: Maybe<ProdiJabatanDosen>;
  scopusId?: Maybe<Scalars['String']['output']>;
  sintaId?: Maybe<Scalars['String']['output']>;
  wosId?: Maybe<Scalars['String']['output']>;
};

export type Fakultas = {
  __typename?: 'Fakultas';
  id: Scalars['ID']['output'];
  nama: Scalars['String']['output'];
  prodi?: Maybe<Array<Prodi>>;
};

export type FakultasJabatanDosen = {
  __typename?: 'FakultasJabatanDosen';
  id: Scalars['String']['output'];
  nama: Scalars['String']['output'];
};

export type GradeRemun = {
  __typename?: 'GradeRemun';
  id: Scalars['String']['output'];
  remun: Scalars['Int']['output'];
};

export type Jabatan = {
  __typename?: 'Jabatan';
  id: Scalars['ID']['output'];
  nama: Scalars['String']['output'];
};

export type JabatanKemenag = {
  __typename?: 'JabatanKemenag';
  bidangStudi?: Maybe<Scalars['String']['output']>;
  nama?: Maybe<Scalars['String']['output']>;
  noSk?: Maybe<Scalars['String']['output']>;
  tmt: Scalars['Date']['output'];
  unitKerja?: Maybe<Scalars['String']['output']>;
};

export type JabatanLevel = {
  __typename?: 'JabatanLevel';
  id: Scalars['ID']['output'];
  level: Array<StrukturLevelJabatan>;
  nama: Scalars['String']['output'];
};

export enum JenisJabatanInput {
  Ds = 'DS',
  Dt = 'DT',
  Tendik = 'Tendik'
}

export enum JenisKelaminEnum {
  L = 'L',
  P = 'P'
}

export type Kontak = {
  __typename?: 'Kontak';
  emailPribadi?: Maybe<Scalars['String']['output']>;
  emailUinar?: Maybe<Scalars['String']['output']>;
  noHp?: Maybe<Scalars['String']['output']>;
};

export type LevelJabatan = {
  __typename?: 'LevelJabatan';
  id: Scalars['String']['output'];
  jabatan: Jabatan;
  nama: Scalars['String']['output'];
  ssoRole: SsoRole;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBagianUnitKerja: MutationBagianUnitKerjaResponse;
  createFakultas: MutationFakultasResponse;
  createGradeRemun: MutationGradeRemunResponse;
  createJabatanPegawai: MutationPegawaiResponse;
  createLeveljabatan: MutationLevelJabatanResponse;
  createPegawaiNotSync: MutationPegawaiResponse;
  createPegawaiSync: MutationPegawaiResponse;
  createPosisi: MutationPosisiResponse;
  createProdi: MutationProdiResponse;
  createStatusAktif: MutationStatusAktifResponse;
  createStrukturJabatan: MutationStrukturJabatanResponse;
  createStrukturOrganisasi: MutationStrukturOrganisasiResponse;
  createSubLevelJabatan: MutationSublevelJabatanResponse;
  createSubbagUnitKerja: MutationSubbagUnitKerjaResponse;
  createUnitGaji: MutationUnitGajiResponse;
  createUnitKerja: MutationUnitKerjaResponse;
  createUnitKerjaPegawai: MutationPegawaiResponse;
  deleteBagianUnitKerja: MutationBagianUnitKerjaResponse;
  deleteFakultas: MutationFakultasResponse;
  deleteGradeRemun: MutationGradeRemunResponse;
  deleteJabatanPegawai: MutationPegawaiResponse;
  deleteLevelJabatan: MutationLevelJabatanResponse;
  deletePegawai: MutationPegawaiResponse;
  deletePosisi: MutationPosisiResponse;
  deleteProdi: MutationProdiResponse;
  deleteStatusAktif: MutationStatusAktifResponse;
  deleteStrukturJabatan: MutationStrukturJabatanResponse;
  deleteStrukturOrganisasi: MutationStrukturOrganisasiResponse;
  deleteSubLevelJabatan: MutationSublevelJabatanResponse;
  deleteSubbagUnitKerja: MutationSubbagUnitKerjaResponse;
  deleteUnitGaji: MutationUnitGajiResponse;
  deleteUnitKerja: MutationUnitKerjaResponse;
  deleteUnitKerjaPegawai: MutationPegawaiResponse;
  syncAsn: MutationPegawaiResponse;
  updateBagianUnitKerja: MutationBagianUnitKerjaResponse;
  updateFakultas: MutationFakultasResponse;
  updateGradeRemun: MutationGradeRemunResponse;
  updateLevelJabatan: MutationLevelJabatanResponse;
  updatePegawaiProfil: MutationPegawaiResponse;
  updatePegawaiStatusAktif: MutationPegawaiResponse;
  updatePegawaiStatusPegawai: MutationPegawaiResponse;
  updatePosisi: MutationPosisiResponse;
  updateProdi: MutationProdiResponse;
  updateStatusAktif: MutationStatusAktifResponse;
  updateStrukturJabatan: MutationStrukturJabatanResponse;
  updateStrukturOrganisasi: MutationStrukturOrganisasiResponse;
  updateSubbagUnitKerja: MutationSubbagUnitKerjaResponse;
  updateSublevelJabatan: MutationSublevelJabatanResponse;
  updateUnitGaji: MutationUnitGajiResponse;
  updateUnitKerja: MutationUnitKerjaResponse;
  updateUnitKerjaPegawai: MutationPegawaiResponse;
  upsertDosen: MutationPegawaiResponse;
};


export type MutationCreateBagianUnitKerjaArgs = {
  nama: Scalars['String']['input'];
};


export type MutationCreateFakultasArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationCreateGradeRemunArgs = {
  id: Scalars['ID']['input'];
  remun: Scalars['Int']['input'];
};


export type MutationCreateJabatanPegawaiArgs = {
  pegawaiId: Scalars['ID']['input'];
  strukturJabatanId: Scalars['ID']['input'];
};


export type MutationCreateLeveljabatanArgs = {
  jabatanId: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
  ssoRole: Scalars['ID']['input'];
};


export type MutationCreatePegawaiNotSyncArgs = {
  input?: InputMaybe<CreatePegawaiNotSyncInput>;
};


export type MutationCreatePegawaiSyncArgs = {
  input?: InputMaybe<CreatePegawaiSyncInput>;
};


export type MutationCreatePosisiArgs = {
  id: Scalars['ID']['input'];
  kategori: Scalars['Int']['input'];
  nama: Scalars['String']['input'];
};


export type MutationCreateProdiArgs = {
  fakultasId: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationCreateStatusAktifArgs = {
  isActive: Scalars['Boolean']['input'];
  nama: Scalars['String']['input'];
  ssoEnabled: Scalars['Boolean']['input'];
};


export type MutationCreateStrukturJabatanArgs = {
  input?: InputMaybe<CreateStrukturJabatanInput>;
};


export type MutationCreateStrukturOrganisasiArgs = {
  input: CreateStrukturOrganisasiInput;
};


export type MutationCreateSubLevelJabatanArgs = {
  nama: Scalars['String']['input'];
};


export type MutationCreateSubbagUnitKerjaArgs = {
  nama: Scalars['String']['input'];
};


export type MutationCreateUnitGajiArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationCreateUnitKerjaArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationCreateUnitKerjaPegawaiArgs = {
  isSecondary: Scalars['Boolean']['input'];
  pegawaiId: Scalars['ID']['input'];
  strukturOrganisasiId: Scalars['ID']['input'];
};


export type MutationDeleteBagianUnitKerjaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFakultasArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGradeRemunArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteJabatanPegawaiArgs = {
  pegawaiId: Scalars['ID']['input'];
  strukturJabatanId: Scalars['ID']['input'];
};


export type MutationDeleteLevelJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePegawaiArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePosisiArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProdiArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStatusAktifArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteStrukturJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStrukturOrganisasiArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubLevelJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubbagUnitKerjaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUnitGajiArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUnitKerjaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUnitKerjaPegawaiArgs = {
  pegawaiId: Scalars['ID']['input'];
  strukturOrganisasiId: Scalars['ID']['input'];
};


export type MutationSyncAsnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateBagianUnitKerjaArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateFakultasArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateGradeRemunArgs = {
  id: Scalars['ID']['input'];
  remun: Scalars['Int']['input'];
};


export type MutationUpdateLevelJabatanArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
  ssoRole: Scalars['ID']['input'];
};


export type MutationUpdatePegawaiProfilArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePegawaiProfilInput;
};


export type MutationUpdatePegawaiStatusAktifArgs = {
  id: Scalars['ID']['input'];
  statusAktifId: Scalars['Int']['input'];
};


export type MutationUpdatePegawaiStatusPegawaiArgs = {
  id: Scalars['ID']['input'];
  statusPegawaiId: Scalars['Int']['input'];
};


export type MutationUpdatePosisiArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateProdiArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateStatusAktifArgs = {
  id: Scalars['Int']['input'];
  isActive: Scalars['Boolean']['input'];
  nama: Scalars['String']['input'];
  ssoEnabled: Scalars['Boolean']['input'];
};


export type MutationUpdateStrukturJabatanArgs = {
  grade: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateStrukturOrganisasiArgs = {
  grade: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateSubbagUnitKerjaArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateSublevelJabatanArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateUnitGajiArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateUnitKerjaArgs = {
  id: Scalars['ID']['input'];
  nama: Scalars['String']['input'];
};


export type MutationUpdateUnitKerjaPegawaiArgs = {
  isSecondary: Scalars['Boolean']['input'];
  pegawaiId: Scalars['ID']['input'];
  strukturOrganisasiId: Scalars['ID']['input'];
};


export type MutationUpsertDosenArgs = {
  input?: InputMaybe<UpsertDosenInput>;
  pegawaiId: Scalars['ID']['input'];
};

export type MutationBagianUnitKerjaResponse = MutationResponse & {
  __typename?: 'MutationBagianUnitKerjaResponse';
  bagian?: Maybe<BagianUnitKerja>;
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MutationFakultasResponse = MutationResponse & {
  __typename?: 'MutationFakultasResponse';
  code: Scalars['Int']['output'];
  fakultas?: Maybe<Fakultas>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MutationGradeRemunResponse = MutationResponse & {
  __typename?: 'MutationGradeRemunResponse';
  code: Scalars['Int']['output'];
  gradeRemun?: Maybe<GradeRemun>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MutationLevelJabatanResponse = MutationResponse & {
  __typename?: 'MutationLevelJabatanResponse';
  code: Scalars['Int']['output'];
  level?: Maybe<LevelJabatan>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MutationPegawaiResponse = MutationResponse & {
  __typename?: 'MutationPegawaiResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  /** Newly updated pegawai after a successful mutation */
  pegawai?: Maybe<Pegawai>;
  success: Scalars['Boolean']['output'];
};

export type MutationPosisiResponse = MutationResponse & {
  __typename?: 'MutationPosisiResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  posisi?: Maybe<Posisi>;
  success: Scalars['Boolean']['output'];
};

export type MutationProdiResponse = MutationResponse & {
  __typename?: 'MutationProdiResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  prodi?: Maybe<Prodi>;
  success: Scalars['Boolean']['output'];
};

export type MutationResponse = {
  /** Similar to HTTP status code, represents the status of the mutation */
  code: Scalars['Int']['output'];
  /** human-readable message for UI */
  message: Scalars['String']['output'];
  /** Indicates whether the mutation was successful */
  success: Scalars['Boolean']['output'];
};

export type MutationStatusAktifResponse = MutationResponse & {
  __typename?: 'MutationStatusAktifResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  statusAktif?: Maybe<StatusAktif>;
  success: Scalars['Boolean']['output'];
};

export type MutationStrukturJabatanResponse = MutationResponse & {
  __typename?: 'MutationStrukturJabatanResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  strukturJabatan?: Maybe<StrukturJabatan>;
  success: Scalars['Boolean']['output'];
};

export type MutationStrukturOrganisasiResponse = MutationResponse & {
  __typename?: 'MutationStrukturOrganisasiResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  strukturOrganisasi?: Maybe<StrukturOrganisasi>;
  success: Scalars['Boolean']['output'];
};

export type MutationSubbagUnitKerjaResponse = MutationResponse & {
  __typename?: 'MutationSubbagUnitKerjaResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  subbag?: Maybe<SubbagUnitKerja>;
  success: Scalars['Boolean']['output'];
};

export type MutationSublevelJabatanResponse = MutationResponse & {
  __typename?: 'MutationSublevelJabatanResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  sublevel?: Maybe<SublevelJabatan>;
  success: Scalars['Boolean']['output'];
};

export type MutationUnitGajiResponse = MutationResponse & {
  __typename?: 'MutationUnitGajiResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  unitGaji?: Maybe<UnitGaji>;
};

export type MutationUnitKerjaResponse = MutationResponse & {
  __typename?: 'MutationUnitKerjaResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  unitKerja?: Maybe<UnitKerja>;
};

export type Pangkat = {
  __typename?: 'Pangkat';
  golonganRuang: Scalars['String']['output'];
  ket?: Maybe<Scalars['String']['output']>;
  nama: Scalars['String']['output'];
  noSk?: Maybe<Scalars['String']['output']>;
  tmt: Scalars['Date']['output'];
};

export type Pegawai = {
  __typename?: 'Pegawai';
  agama?: Maybe<Scalars['String']['output']>;
  alamat?: Maybe<Alamat>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  dosen?: Maybe<Dosen>;
  id: Scalars['ID']['output'];
  jabatanSaatIni?: Maybe<StrukturJabatan>;
  jenisJabatan?: Maybe<Scalars['String']['output']>;
  jenisKelamin?: Maybe<Scalars['String']['output']>;
  kontak?: Maybe<Kontak>;
  nama: Scalars['String']['output'];
  nik?: Maybe<Scalars['String']['output']>;
  nipLama?: Maybe<Scalars['String']['output']>;
  nuptk?: Maybe<Scalars['String']['output']>;
  riwayatJabatanKemenag?: Maybe<Array<JabatanKemenag>>;
  riwayatPangkat?: Maybe<Array<Pangkat>>;
  riwayatPendidikan?: Maybe<Array<Pendidikan>>;
  statusAktif: StatusAktif;
  statusKawin?: Maybe<Scalars['String']['output']>;
  statusPegawai: StatusPegawai;
  tempatLahir?: Maybe<Scalars['String']['output']>;
  tglLahir?: Maybe<Scalars['Date']['output']>;
  tmtKgbYad?: Maybe<Scalars['Date']['output']>;
  tmtPangkatYad?: Maybe<Scalars['Date']['output']>;
  tmtPensiun?: Maybe<Scalars['Date']['output']>;
  unitGaji?: Maybe<UnitGaji>;
  unitKerjaSaatIni?: Maybe<Array<UnitKerjaPegawai>>;
  unitRemun?: Maybe<UnitGaji>;
  updatedAt: Scalars['DateTime']['output'];
  updatedBy: Scalars['String']['output'];
};

export type PegawaiFilterInput = {
  daftarStatusAktifId?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  daftarStatusPegawaiId?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  jenisJabatan?: InputMaybe<Array<InputMaybe<JenisJabatanInput>>>;
  searchString?: InputMaybe<Scalars['String']['input']>;
};

export type PegawaiOrderByInput = {
  id?: InputMaybe<Sort>;
  nama?: InputMaybe<Sort>;
};

export type Pendidikan = {
  __typename?: 'Pendidikan';
  akta?: Maybe<Scalars['String']['output']>;
  fakultas?: Maybe<Scalars['String']['output']>;
  jenjang: Scalars['String']['output'];
  jurusan?: Maybe<Scalars['String']['output']>;
  lokasiSekolah?: Maybe<Scalars['String']['output']>;
  namaSekolah: Scalars['String']['output'];
  tahunLulus: Scalars['Int']['output'];
};

export type Posisi = {
  __typename?: 'Posisi';
  id: Scalars['ID']['output'];
  kategori: Scalars['Int']['output'];
  nama: Scalars['String']['output'];
};

export type Prodi = {
  __typename?: 'Prodi';
  id: Scalars['String']['output'];
  nama: Scalars['String']['output'];
};

export type ProdiJabatanDosen = {
  __typename?: 'ProdiJabatanDosen';
  fakultas: FakultasJabatanDosen;
  id: Scalars['ID']['output'];
  nama: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  bagianUnitKerja?: Maybe<BagianUnitKerja>;
  daftarBagianUnitKerja: Array<BagianUnitKerja>;
  daftarFakultas: Array<Fakultas>;
  daftarGradeRemun: Array<GradeRemun>;
  daftarJabatan: Array<JabatanLevel>;
  daftarPegawai: DaftarPegawaiResponse;
  daftarPosisi: Array<Posisi>;
  daftarSsoRole: Array<SsoRole>;
  daftarStatusAktif: Array<StatusAktif>;
  daftarStatusPegawai: Array<StatusPegawai>;
  daftarStrukturJabatan?: Maybe<Array<StrukturJabatan>>;
  daftarStrukturOrganisasi?: Maybe<Array<StrukturOrganisasi>>;
  daftarSubbagUnitKerja: Array<SubbagUnitKerja>;
  daftarSublevelJabatan: Array<SublevelJabatan>;
  daftarUnitGaji: Array<UnitGaji>;
  daftarUnitKerja: Array<UnitKerja>;
  fakultas?: Maybe<Fakultas>;
  gradeRemun?: Maybe<GradeRemun>;
  jabatan?: Maybe<JabatanLevel>;
  levelJabatan?: Maybe<LevelJabatan>;
  pegawai?: Maybe<Pegawai>;
  statusPegawai?: Maybe<StatusPegawai>;
  strukturJabatan?: Maybe<StrukturJabatan>;
  subbagUnitKerja?: Maybe<SubbagUnitKerja>;
  sublevelJabatan?: Maybe<SublevelJabatan>;
  unitGaji?: Maybe<UnitGaji>;
  unitKerja?: Maybe<UnitKerja>;
};


export type QueryBagianUnitKerjaArgs = {
  id: Scalars['ID']['input'];
  unitKerjaId: Scalars['ID']['input'];
};


export type QueryDaftarPegawaiArgs = {
  filter?: InputMaybe<PegawaiFilterInput>;
  orderBy?: InputMaybe<PegawaiOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDaftarStrukturJabatanArgs = {
  levelId?: InputMaybe<Scalars['ID']['input']>;
  sublevelId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDaftarStrukturOrganisasiArgs = {
  bagianId?: InputMaybe<Scalars['ID']['input']>;
  subbagId?: InputMaybe<Scalars['ID']['input']>;
  unitKerjaId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFakultasArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGradeRemunArgs = {
  id: Scalars['ID']['input'];
};


export type QueryJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLevelJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPegawaiArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStatusPegawaiArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStrukturJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubbagUnitKerjaArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySublevelJabatanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUnitGajiArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUnitKerjaArgs = {
  id: Scalars['ID']['input'];
};

export enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export type SsoRole = {
  __typename?: 'SsoRole';
  code: Scalars['ID']['output'];
  description: Scalars['String']['output'];
};

export type StatusAktif = {
  __typename?: 'StatusAktif';
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  nama: Scalars['String']['output'];
  ssoEnabled: Scalars['Boolean']['output'];
};

export type StatusPegawai = {
  __typename?: 'StatusPegawai';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isSync: Scalars['Boolean']['output'];
  nama: Scalars['String']['output'];
};

export type StrukturJabatan = {
  __typename?: 'StrukturJabatan';
  grade?: Maybe<GradeRemun>;
  id: Scalars['ID']['output'];
  level: LevelJabatan;
  sublevel?: Maybe<SublevelJabatan>;
};

export type StrukturLevelJabatan = {
  __typename?: 'StrukturLevelJabatan';
  id: Scalars['ID']['output'];
  nama: Scalars['String']['output'];
  ssoRole: SsoRole;
};

export type StrukturOrganisasi = {
  __typename?: 'StrukturOrganisasi';
  bagian?: Maybe<BagianUnitKerja>;
  grade?: Maybe<GradeRemun>;
  id: Scalars['ID']['output'];
  pegawai?: Maybe<Array<Pegawai>>;
  posisi: Posisi;
  subbag?: Maybe<SubbagUnitKerja>;
  unitKerja?: Maybe<UnitKerja>;
};

export type SubbagUnitKerja = {
  __typename?: 'SubbagUnitKerja';
  id: Scalars['String']['output'];
  nama: Scalars['String']['output'];
};

export type SublevelJabatan = {
  __typename?: 'SublevelJabatan';
  id: Scalars['String']['output'];
  nama: Scalars['String']['output'];
};

export type UnitGaji = {
  __typename?: 'UnitGaji';
  id: Scalars['ID']['output'];
  nama: Scalars['String']['output'];
};

export type UnitKerja = {
  __typename?: 'UnitKerja';
  id: Scalars['ID']['output'];
  nama: Scalars['String']['output'];
};

export type UnitKerjaPegawai = {
  __typename?: 'UnitKerjaPegawai';
  bagian?: Maybe<BagianUnitKerja>;
  grade?: Maybe<GradeRemun>;
  id: Scalars['ID']['output'];
  isSecondary: Scalars['Boolean']['output'];
  posisi: Posisi;
  subbag?: Maybe<SubbagUnitKerja>;
  unitKerja?: Maybe<UnitKerja>;
};

export type UpdatePegawaiProfilInput = {
  agama?: InputMaybe<Scalars['String']['input']>;
  emailPribadi?: InputMaybe<Scalars['String']['input']>;
  emailUinar?: InputMaybe<Scalars['String']['input']>;
  jenisKelamin?: InputMaybe<JenisKelaminEnum>;
  nama?: InputMaybe<Scalars['String']['input']>;
  noHp?: InputMaybe<Scalars['String']['input']>;
  statusKawin?: InputMaybe<Scalars['String']['input']>;
  tempatLahir?: InputMaybe<Scalars['String']['input']>;
  tglLahir?: InputMaybe<Scalars['Date']['input']>;
  unitGajiId: Scalars['String']['input'];
  unitRemunId: Scalars['String']['input'];
};

export type UpsertDosenInput = {
  gsId?: InputMaybe<Scalars['String']['input']>;
  orcidId?: InputMaybe<Scalars['String']['input']>;
  prodiId?: InputMaybe<Scalars['String']['input']>;
  scopusId?: InputMaybe<Scalars['String']['input']>;
  sintaId?: InputMaybe<Scalars['String']['input']>;
  wosId?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  MutationResponse: ( MutationBagianUnitKerjaResponse ) | ( Omit<MutationFakultasResponse, 'fakultas'> & { fakultas?: Maybe<_RefType['Fakultas']> } ) | ( MutationGradeRemunResponse ) | ( Omit<MutationLevelJabatanResponse, 'level'> & { level?: Maybe<_RefType['LevelJabatan']> } ) | ( Omit<MutationPegawaiResponse, 'pegawai'> & { pegawai?: Maybe<_RefType['Pegawai']> } ) | ( MutationPosisiResponse ) | ( MutationProdiResponse ) | ( MutationStatusAktifResponse ) | ( Omit<MutationStrukturJabatanResponse, 'strukturJabatan'> & { strukturJabatan?: Maybe<_RefType['StrukturJabatan']> } ) | ( Omit<MutationStrukturOrganisasiResponse, 'strukturOrganisasi'> & { strukturOrganisasi?: Maybe<_RefType['StrukturOrganisasi']> } ) | ( MutationSubbagUnitKerjaResponse ) | ( MutationSublevelJabatanResponse ) | ( MutationUnitGajiResponse ) | ( MutationUnitKerjaResponse );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Alamat: ResolverTypeWrapper<Alamat>;
  BagianUnitKerja: ResolverTypeWrapper<BagianUnitKerja>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreatePegawaiNotSyncInput: CreatePegawaiNotSyncInput;
  CreatePegawaiSyncInput: CreatePegawaiSyncInput;
  CreateStrukturJabatanInput: CreateStrukturJabatanInput;
  CreateStrukturOrganisasiInput: CreateStrukturOrganisasiInput;
  DaftarPegawaiResponse: ResolverTypeWrapper<Omit<DaftarPegawaiResponse, 'pegawai'> & { pegawai?: Maybe<Array<ResolversTypes['Pegawai']>> }>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Dosen: ResolverTypeWrapper<DosenModel>;
  Fakultas: ResolverTypeWrapper<FakultasModel>;
  FakultasJabatanDosen: ResolverTypeWrapper<FakultasJabatanDosen>;
  GradeRemun: ResolverTypeWrapper<GradeRemun>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Jabatan: ResolverTypeWrapper<Jabatan>;
  JabatanKemenag: ResolverTypeWrapper<JabatanKemenag>;
  JabatanLevel: ResolverTypeWrapper<JabatanLevelModel>;
  JenisJabatanInput: JenisJabatanInput;
  JenisKelaminEnum: JenisKelaminEnum;
  Kontak: ResolverTypeWrapper<Kontak>;
  LevelJabatan: ResolverTypeWrapper<LevelJabatanModel>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationBagianUnitKerjaResponse: ResolverTypeWrapper<MutationBagianUnitKerjaResponse>;
  MutationFakultasResponse: ResolverTypeWrapper<Omit<MutationFakultasResponse, 'fakultas'> & { fakultas?: Maybe<ResolversTypes['Fakultas']> }>;
  MutationGradeRemunResponse: ResolverTypeWrapper<MutationGradeRemunResponse>;
  MutationLevelJabatanResponse: ResolverTypeWrapper<Omit<MutationLevelJabatanResponse, 'level'> & { level?: Maybe<ResolversTypes['LevelJabatan']> }>;
  MutationPegawaiResponse: ResolverTypeWrapper<Omit<MutationPegawaiResponse, 'pegawai'> & { pegawai?: Maybe<ResolversTypes['Pegawai']> }>;
  MutationPosisiResponse: ResolverTypeWrapper<MutationPosisiResponse>;
  MutationProdiResponse: ResolverTypeWrapper<MutationProdiResponse>;
  MutationResponse: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['MutationResponse']>;
  MutationStatusAktifResponse: ResolverTypeWrapper<MutationStatusAktifResponse>;
  MutationStrukturJabatanResponse: ResolverTypeWrapper<Omit<MutationStrukturJabatanResponse, 'strukturJabatan'> & { strukturJabatan?: Maybe<ResolversTypes['StrukturJabatan']> }>;
  MutationStrukturOrganisasiResponse: ResolverTypeWrapper<Omit<MutationStrukturOrganisasiResponse, 'strukturOrganisasi'> & { strukturOrganisasi?: Maybe<ResolversTypes['StrukturOrganisasi']> }>;
  MutationSubbagUnitKerjaResponse: ResolverTypeWrapper<MutationSubbagUnitKerjaResponse>;
  MutationSublevelJabatanResponse: ResolverTypeWrapper<MutationSublevelJabatanResponse>;
  MutationUnitGajiResponse: ResolverTypeWrapper<MutationUnitGajiResponse>;
  MutationUnitKerjaResponse: ResolverTypeWrapper<MutationUnitKerjaResponse>;
  Pangkat: ResolverTypeWrapper<Pangkat>;
  Pegawai: ResolverTypeWrapper<PegawaiModel>;
  PegawaiFilterInput: PegawaiFilterInput;
  PegawaiOrderByInput: PegawaiOrderByInput;
  Pendidikan: ResolverTypeWrapper<Pendidikan>;
  Posisi: ResolverTypeWrapper<Posisi>;
  Prodi: ResolverTypeWrapper<Prodi>;
  ProdiJabatanDosen: ResolverTypeWrapper<ProdiJabatanDosenModel>;
  Query: ResolverTypeWrapper<{}>;
  Sort: Sort;
  SsoRole: ResolverTypeWrapper<SsoRole>;
  StatusAktif: ResolverTypeWrapper<StatusAktif>;
  StatusPegawai: ResolverTypeWrapper<StatusPegawai>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StrukturJabatan: ResolverTypeWrapper<StrukturJabatanModel>;
  StrukturLevelJabatan: ResolverTypeWrapper<StrukturLevelJabatanModel>;
  StrukturOrganisasi: ResolverTypeWrapper<StrukturOrganisasiModel>;
  SubbagUnitKerja: ResolverTypeWrapper<SubbagUnitKerja>;
  SublevelJabatan: ResolverTypeWrapper<SublevelJabatan>;
  UnitGaji: ResolverTypeWrapper<UnitGaji>;
  UnitKerja: ResolverTypeWrapper<UnitKerja>;
  UnitKerjaPegawai: ResolverTypeWrapper<UnitKerjaPegawaiModel>;
  UpdatePegawaiProfilInput: UpdatePegawaiProfilInput;
  UpsertDosenInput: UpsertDosenInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Alamat: Alamat;
  BagianUnitKerja: BagianUnitKerja;
  Boolean: Scalars['Boolean']['output'];
  CreatePegawaiNotSyncInput: CreatePegawaiNotSyncInput;
  CreatePegawaiSyncInput: CreatePegawaiSyncInput;
  CreateStrukturJabatanInput: CreateStrukturJabatanInput;
  CreateStrukturOrganisasiInput: CreateStrukturOrganisasiInput;
  DaftarPegawaiResponse: Omit<DaftarPegawaiResponse, 'pegawai'> & { pegawai?: Maybe<Array<ResolversParentTypes['Pegawai']>> };
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  Dosen: DosenModel;
  Fakultas: FakultasModel;
  FakultasJabatanDosen: FakultasJabatanDosen;
  GradeRemun: GradeRemun;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Jabatan: Jabatan;
  JabatanKemenag: JabatanKemenag;
  JabatanLevel: JabatanLevelModel;
  Kontak: Kontak;
  LevelJabatan: LevelJabatanModel;
  Mutation: {};
  MutationBagianUnitKerjaResponse: MutationBagianUnitKerjaResponse;
  MutationFakultasResponse: Omit<MutationFakultasResponse, 'fakultas'> & { fakultas?: Maybe<ResolversParentTypes['Fakultas']> };
  MutationGradeRemunResponse: MutationGradeRemunResponse;
  MutationLevelJabatanResponse: Omit<MutationLevelJabatanResponse, 'level'> & { level?: Maybe<ResolversParentTypes['LevelJabatan']> };
  MutationPegawaiResponse: Omit<MutationPegawaiResponse, 'pegawai'> & { pegawai?: Maybe<ResolversParentTypes['Pegawai']> };
  MutationPosisiResponse: MutationPosisiResponse;
  MutationProdiResponse: MutationProdiResponse;
  MutationResponse: ResolversInterfaceTypes<ResolversParentTypes>['MutationResponse'];
  MutationStatusAktifResponse: MutationStatusAktifResponse;
  MutationStrukturJabatanResponse: Omit<MutationStrukturJabatanResponse, 'strukturJabatan'> & { strukturJabatan?: Maybe<ResolversParentTypes['StrukturJabatan']> };
  MutationStrukturOrganisasiResponse: Omit<MutationStrukturOrganisasiResponse, 'strukturOrganisasi'> & { strukturOrganisasi?: Maybe<ResolversParentTypes['StrukturOrganisasi']> };
  MutationSubbagUnitKerjaResponse: MutationSubbagUnitKerjaResponse;
  MutationSublevelJabatanResponse: MutationSublevelJabatanResponse;
  MutationUnitGajiResponse: MutationUnitGajiResponse;
  MutationUnitKerjaResponse: MutationUnitKerjaResponse;
  Pangkat: Pangkat;
  Pegawai: PegawaiModel;
  PegawaiFilterInput: PegawaiFilterInput;
  PegawaiOrderByInput: PegawaiOrderByInput;
  Pendidikan: Pendidikan;
  Posisi: Posisi;
  Prodi: Prodi;
  ProdiJabatanDosen: ProdiJabatanDosenModel;
  Query: {};
  SsoRole: SsoRole;
  StatusAktif: StatusAktif;
  StatusPegawai: StatusPegawai;
  String: Scalars['String']['output'];
  StrukturJabatan: StrukturJabatanModel;
  StrukturLevelJabatan: StrukturLevelJabatanModel;
  StrukturOrganisasi: StrukturOrganisasiModel;
  SubbagUnitKerja: SubbagUnitKerja;
  SublevelJabatan: SublevelJabatan;
  UnitGaji: UnitGaji;
  UnitKerja: UnitKerja;
  UnitKerjaPegawai: UnitKerjaPegawaiModel;
  UpdatePegawaiProfilInput: UpdatePegawaiProfilInput;
  UpsertDosenInput: UpsertDosenInput;
}>;

export type AlamatResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Alamat'] = ResolversParentTypes['Alamat']> = ResolversObject<{
  deskripsi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kabKota?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kodePos?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  provinsi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BagianUnitKerjaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['BagianUnitKerja'] = ResolversParentTypes['BagianUnitKerja']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DaftarPegawaiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DaftarPegawaiResponse'] = ResolversParentTypes['DaftarPegawaiResponse']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pegawai?: Resolver<Maybe<Array<ResolversTypes['Pegawai']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DosenResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Dosen'] = ResolversParentTypes['Dosen']> = ResolversObject<{
  gsId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nidn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orcidId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prodi?: Resolver<Maybe<ResolversTypes['ProdiJabatanDosen']>, ParentType, ContextType>;
  scopusId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sintaId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  wosId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FakultasResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Fakultas'] = ResolversParentTypes['Fakultas']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prodi?: Resolver<Maybe<Array<ResolversTypes['Prodi']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FakultasJabatanDosenResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FakultasJabatanDosen'] = ResolversParentTypes['FakultasJabatanDosen']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GradeRemunResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GradeRemun'] = ResolversParentTypes['GradeRemun']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  remun?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type JabatanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Jabatan'] = ResolversParentTypes['Jabatan']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type JabatanKemenagResolvers<ContextType = Context, ParentType extends ResolversParentTypes['JabatanKemenag'] = ResolversParentTypes['JabatanKemenag']> = ResolversObject<{
  bidangStudi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nama?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  noSk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tmt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  unitKerja?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type JabatanLevelResolvers<ContextType = Context, ParentType extends ResolversParentTypes['JabatanLevel'] = ResolversParentTypes['JabatanLevel']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  level?: Resolver<Array<ResolversTypes['StrukturLevelJabatan']>, ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type KontakResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Kontak'] = ResolversParentTypes['Kontak']> = ResolversObject<{
  emailPribadi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailUinar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  noHp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LevelJabatanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LevelJabatan'] = ResolversParentTypes['LevelJabatan']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jabatan?: Resolver<ResolversTypes['Jabatan'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ssoRole?: Resolver<ResolversTypes['SsoRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createBagianUnitKerja?: Resolver<ResolversTypes['MutationBagianUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationCreateBagianUnitKerjaArgs, 'nama'>>;
  createFakultas?: Resolver<ResolversTypes['MutationFakultasResponse'], ParentType, ContextType, RequireFields<MutationCreateFakultasArgs, 'id' | 'nama'>>;
  createGradeRemun?: Resolver<ResolversTypes['MutationGradeRemunResponse'], ParentType, ContextType, RequireFields<MutationCreateGradeRemunArgs, 'id' | 'remun'>>;
  createJabatanPegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationCreateJabatanPegawaiArgs, 'pegawaiId' | 'strukturJabatanId'>>;
  createLeveljabatan?: Resolver<ResolversTypes['MutationLevelJabatanResponse'], ParentType, ContextType, RequireFields<MutationCreateLeveljabatanArgs, 'jabatanId' | 'nama' | 'ssoRole'>>;
  createPegawaiNotSync?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, Partial<MutationCreatePegawaiNotSyncArgs>>;
  createPegawaiSync?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, Partial<MutationCreatePegawaiSyncArgs>>;
  createPosisi?: Resolver<ResolversTypes['MutationPosisiResponse'], ParentType, ContextType, RequireFields<MutationCreatePosisiArgs, 'id' | 'kategori' | 'nama'>>;
  createProdi?: Resolver<ResolversTypes['MutationProdiResponse'], ParentType, ContextType, RequireFields<MutationCreateProdiArgs, 'fakultasId' | 'nama'>>;
  createStatusAktif?: Resolver<ResolversTypes['MutationStatusAktifResponse'], ParentType, ContextType, RequireFields<MutationCreateStatusAktifArgs, 'isActive' | 'nama' | 'ssoEnabled'>>;
  createStrukturJabatan?: Resolver<ResolversTypes['MutationStrukturJabatanResponse'], ParentType, ContextType, Partial<MutationCreateStrukturJabatanArgs>>;
  createStrukturOrganisasi?: Resolver<ResolversTypes['MutationStrukturOrganisasiResponse'], ParentType, ContextType, RequireFields<MutationCreateStrukturOrganisasiArgs, 'input'>>;
  createSubLevelJabatan?: Resolver<ResolversTypes['MutationSublevelJabatanResponse'], ParentType, ContextType, RequireFields<MutationCreateSubLevelJabatanArgs, 'nama'>>;
  createSubbagUnitKerja?: Resolver<ResolversTypes['MutationSubbagUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationCreateSubbagUnitKerjaArgs, 'nama'>>;
  createUnitGaji?: Resolver<ResolversTypes['MutationUnitGajiResponse'], ParentType, ContextType, RequireFields<MutationCreateUnitGajiArgs, 'id' | 'nama'>>;
  createUnitKerja?: Resolver<ResolversTypes['MutationUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationCreateUnitKerjaArgs, 'id' | 'nama'>>;
  createUnitKerjaPegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationCreateUnitKerjaPegawaiArgs, 'isSecondary' | 'pegawaiId' | 'strukturOrganisasiId'>>;
  deleteBagianUnitKerja?: Resolver<ResolversTypes['MutationBagianUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationDeleteBagianUnitKerjaArgs, 'id'>>;
  deleteFakultas?: Resolver<ResolversTypes['MutationFakultasResponse'], ParentType, ContextType, RequireFields<MutationDeleteFakultasArgs, 'id'>>;
  deleteGradeRemun?: Resolver<ResolversTypes['MutationGradeRemunResponse'], ParentType, ContextType, RequireFields<MutationDeleteGradeRemunArgs, 'id'>>;
  deleteJabatanPegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationDeleteJabatanPegawaiArgs, 'pegawaiId' | 'strukturJabatanId'>>;
  deleteLevelJabatan?: Resolver<ResolversTypes['MutationLevelJabatanResponse'], ParentType, ContextType, RequireFields<MutationDeleteLevelJabatanArgs, 'id'>>;
  deletePegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationDeletePegawaiArgs, 'id'>>;
  deletePosisi?: Resolver<ResolversTypes['MutationPosisiResponse'], ParentType, ContextType, RequireFields<MutationDeletePosisiArgs, 'id'>>;
  deleteProdi?: Resolver<ResolversTypes['MutationProdiResponse'], ParentType, ContextType, RequireFields<MutationDeleteProdiArgs, 'id'>>;
  deleteStatusAktif?: Resolver<ResolversTypes['MutationStatusAktifResponse'], ParentType, ContextType, RequireFields<MutationDeleteStatusAktifArgs, 'id'>>;
  deleteStrukturJabatan?: Resolver<ResolversTypes['MutationStrukturJabatanResponse'], ParentType, ContextType, RequireFields<MutationDeleteStrukturJabatanArgs, 'id'>>;
  deleteStrukturOrganisasi?: Resolver<ResolversTypes['MutationStrukturOrganisasiResponse'], ParentType, ContextType, RequireFields<MutationDeleteStrukturOrganisasiArgs, 'id'>>;
  deleteSubLevelJabatan?: Resolver<ResolversTypes['MutationSublevelJabatanResponse'], ParentType, ContextType, RequireFields<MutationDeleteSubLevelJabatanArgs, 'id'>>;
  deleteSubbagUnitKerja?: Resolver<ResolversTypes['MutationSubbagUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationDeleteSubbagUnitKerjaArgs, 'id'>>;
  deleteUnitGaji?: Resolver<ResolversTypes['MutationUnitGajiResponse'], ParentType, ContextType, RequireFields<MutationDeleteUnitGajiArgs, 'id'>>;
  deleteUnitKerja?: Resolver<ResolversTypes['MutationUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationDeleteUnitKerjaArgs, 'id'>>;
  deleteUnitKerjaPegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationDeleteUnitKerjaPegawaiArgs, 'pegawaiId' | 'strukturOrganisasiId'>>;
  syncAsn?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationSyncAsnArgs, 'id'>>;
  updateBagianUnitKerja?: Resolver<ResolversTypes['MutationBagianUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationUpdateBagianUnitKerjaArgs, 'id' | 'nama'>>;
  updateFakultas?: Resolver<ResolversTypes['MutationFakultasResponse'], ParentType, ContextType, RequireFields<MutationUpdateFakultasArgs, 'id' | 'nama'>>;
  updateGradeRemun?: Resolver<ResolversTypes['MutationGradeRemunResponse'], ParentType, ContextType, RequireFields<MutationUpdateGradeRemunArgs, 'id' | 'remun'>>;
  updateLevelJabatan?: Resolver<ResolversTypes['MutationLevelJabatanResponse'], ParentType, ContextType, RequireFields<MutationUpdateLevelJabatanArgs, 'id' | 'nama' | 'ssoRole'>>;
  updatePegawaiProfil?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationUpdatePegawaiProfilArgs, 'id' | 'input'>>;
  updatePegawaiStatusAktif?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationUpdatePegawaiStatusAktifArgs, 'id' | 'statusAktifId'>>;
  updatePegawaiStatusPegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationUpdatePegawaiStatusPegawaiArgs, 'id' | 'statusPegawaiId'>>;
  updatePosisi?: Resolver<ResolversTypes['MutationPosisiResponse'], ParentType, ContextType, RequireFields<MutationUpdatePosisiArgs, 'id' | 'nama'>>;
  updateProdi?: Resolver<ResolversTypes['MutationProdiResponse'], ParentType, ContextType, RequireFields<MutationUpdateProdiArgs, 'id' | 'nama'>>;
  updateStatusAktif?: Resolver<ResolversTypes['MutationStatusAktifResponse'], ParentType, ContextType, RequireFields<MutationUpdateStatusAktifArgs, 'id' | 'isActive' | 'nama' | 'ssoEnabled'>>;
  updateStrukturJabatan?: Resolver<ResolversTypes['MutationStrukturJabatanResponse'], ParentType, ContextType, RequireFields<MutationUpdateStrukturJabatanArgs, 'grade' | 'id'>>;
  updateStrukturOrganisasi?: Resolver<ResolversTypes['MutationStrukturOrganisasiResponse'], ParentType, ContextType, RequireFields<MutationUpdateStrukturOrganisasiArgs, 'grade' | 'id'>>;
  updateSubbagUnitKerja?: Resolver<ResolversTypes['MutationSubbagUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationUpdateSubbagUnitKerjaArgs, 'id' | 'nama'>>;
  updateSublevelJabatan?: Resolver<ResolversTypes['MutationSublevelJabatanResponse'], ParentType, ContextType, RequireFields<MutationUpdateSublevelJabatanArgs, 'id' | 'nama'>>;
  updateUnitGaji?: Resolver<ResolversTypes['MutationUnitGajiResponse'], ParentType, ContextType, RequireFields<MutationUpdateUnitGajiArgs, 'id' | 'nama'>>;
  updateUnitKerja?: Resolver<ResolversTypes['MutationUnitKerjaResponse'], ParentType, ContextType, RequireFields<MutationUpdateUnitKerjaArgs, 'id' | 'nama'>>;
  updateUnitKerjaPegawai?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationUpdateUnitKerjaPegawaiArgs, 'isSecondary' | 'pegawaiId' | 'strukturOrganisasiId'>>;
  upsertDosen?: Resolver<ResolversTypes['MutationPegawaiResponse'], ParentType, ContextType, RequireFields<MutationUpsertDosenArgs, 'pegawaiId'>>;
}>;

export type MutationBagianUnitKerjaResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationBagianUnitKerjaResponse'] = ResolversParentTypes['MutationBagianUnitKerjaResponse']> = ResolversObject<{
  bagian?: Resolver<Maybe<ResolversTypes['BagianUnitKerja']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationFakultasResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationFakultasResponse'] = ResolversParentTypes['MutationFakultasResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fakultas?: Resolver<Maybe<ResolversTypes['Fakultas']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationGradeRemunResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationGradeRemunResponse'] = ResolversParentTypes['MutationGradeRemunResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gradeRemun?: Resolver<Maybe<ResolversTypes['GradeRemun']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationLevelJabatanResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationLevelJabatanResponse'] = ResolversParentTypes['MutationLevelJabatanResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  level?: Resolver<Maybe<ResolversTypes['LevelJabatan']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationPegawaiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationPegawaiResponse'] = ResolversParentTypes['MutationPegawaiResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pegawai?: Resolver<Maybe<ResolversTypes['Pegawai']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationPosisiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationPosisiResponse'] = ResolversParentTypes['MutationPosisiResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posisi?: Resolver<Maybe<ResolversTypes['Posisi']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationProdiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationProdiResponse'] = ResolversParentTypes['MutationProdiResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prodi?: Resolver<Maybe<ResolversTypes['Prodi']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'MutationBagianUnitKerjaResponse' | 'MutationFakultasResponse' | 'MutationGradeRemunResponse' | 'MutationLevelJabatanResponse' | 'MutationPegawaiResponse' | 'MutationPosisiResponse' | 'MutationProdiResponse' | 'MutationStatusAktifResponse' | 'MutationStrukturJabatanResponse' | 'MutationStrukturOrganisasiResponse' | 'MutationSubbagUnitKerjaResponse' | 'MutationSublevelJabatanResponse' | 'MutationUnitGajiResponse' | 'MutationUnitKerjaResponse', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type MutationStatusAktifResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationStatusAktifResponse'] = ResolversParentTypes['MutationStatusAktifResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  statusAktif?: Resolver<Maybe<ResolversTypes['StatusAktif']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationStrukturJabatanResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationStrukturJabatanResponse'] = ResolversParentTypes['MutationStrukturJabatanResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  strukturJabatan?: Resolver<Maybe<ResolversTypes['StrukturJabatan']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationStrukturOrganisasiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationStrukturOrganisasiResponse'] = ResolversParentTypes['MutationStrukturOrganisasiResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  strukturOrganisasi?: Resolver<Maybe<ResolversTypes['StrukturOrganisasi']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationSubbagUnitKerjaResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationSubbagUnitKerjaResponse'] = ResolversParentTypes['MutationSubbagUnitKerjaResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subbag?: Resolver<Maybe<ResolversTypes['SubbagUnitKerja']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationSublevelJabatanResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationSublevelJabatanResponse'] = ResolversParentTypes['MutationSublevelJabatanResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sublevel?: Resolver<Maybe<ResolversTypes['SublevelJabatan']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationUnitGajiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationUnitGajiResponse'] = ResolversParentTypes['MutationUnitGajiResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  unitGaji?: Resolver<Maybe<ResolversTypes['UnitGaji']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationUnitKerjaResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationUnitKerjaResponse'] = ResolversParentTypes['MutationUnitKerjaResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  unitKerja?: Resolver<Maybe<ResolversTypes['UnitKerja']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PangkatResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Pangkat'] = ResolversParentTypes['Pangkat']> = ResolversObject<{
  golonganRuang?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ket?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noSk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tmt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PegawaiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Pegawai'] = ResolversParentTypes['Pegawai']> = ResolversObject<{
  agama?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  alamat?: Resolver<Maybe<ResolversTypes['Alamat']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dosen?: Resolver<Maybe<ResolversTypes['Dosen']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jabatanSaatIni?: Resolver<Maybe<ResolversTypes['StrukturJabatan']>, ParentType, ContextType>;
  jenisJabatan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  jenisKelamin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kontak?: Resolver<Maybe<ResolversTypes['Kontak']>, ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nik?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nipLama?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nuptk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  riwayatJabatanKemenag?: Resolver<Maybe<Array<ResolversTypes['JabatanKemenag']>>, ParentType, ContextType>;
  riwayatPangkat?: Resolver<Maybe<Array<ResolversTypes['Pangkat']>>, ParentType, ContextType>;
  riwayatPendidikan?: Resolver<Maybe<Array<ResolversTypes['Pendidikan']>>, ParentType, ContextType>;
  statusAktif?: Resolver<ResolversTypes['StatusAktif'], ParentType, ContextType>;
  statusKawin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  statusPegawai?: Resolver<ResolversTypes['StatusPegawai'], ParentType, ContextType>;
  tempatLahir?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tglLahir?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  tmtKgbYad?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  tmtPangkatYad?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  tmtPensiun?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  unitGaji?: Resolver<Maybe<ResolversTypes['UnitGaji']>, ParentType, ContextType>;
  unitKerjaSaatIni?: Resolver<Maybe<Array<ResolversTypes['UnitKerjaPegawai']>>, ParentType, ContextType>;
  unitRemun?: Resolver<Maybe<ResolversTypes['UnitGaji']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PendidikanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Pendidikan'] = ResolversParentTypes['Pendidikan']> = ResolversObject<{
  akta?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fakultas?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  jenjang?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jurusan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lokasiSekolah?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  namaSekolah?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tahunLulus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PosisiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Posisi'] = ResolversParentTypes['Posisi']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kategori?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProdiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Prodi'] = ResolversParentTypes['Prodi']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProdiJabatanDosenResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProdiJabatanDosen'] = ResolversParentTypes['ProdiJabatanDosen']> = ResolversObject<{
  fakultas?: Resolver<ResolversTypes['FakultasJabatanDosen'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  bagianUnitKerja?: Resolver<Maybe<ResolversTypes['BagianUnitKerja']>, ParentType, ContextType, RequireFields<QueryBagianUnitKerjaArgs, 'id' | 'unitKerjaId'>>;
  daftarBagianUnitKerja?: Resolver<Array<ResolversTypes['BagianUnitKerja']>, ParentType, ContextType>;
  daftarFakultas?: Resolver<Array<ResolversTypes['Fakultas']>, ParentType, ContextType>;
  daftarGradeRemun?: Resolver<Array<ResolversTypes['GradeRemun']>, ParentType, ContextType>;
  daftarJabatan?: Resolver<Array<ResolversTypes['JabatanLevel']>, ParentType, ContextType>;
  daftarPegawai?: Resolver<ResolversTypes['DaftarPegawaiResponse'], ParentType, ContextType, Partial<QueryDaftarPegawaiArgs>>;
  daftarPosisi?: Resolver<Array<ResolversTypes['Posisi']>, ParentType, ContextType>;
  daftarSsoRole?: Resolver<Array<ResolversTypes['SsoRole']>, ParentType, ContextType>;
  daftarStatusAktif?: Resolver<Array<ResolversTypes['StatusAktif']>, ParentType, ContextType>;
  daftarStatusPegawai?: Resolver<Array<ResolversTypes['StatusPegawai']>, ParentType, ContextType>;
  daftarStrukturJabatan?: Resolver<Maybe<Array<ResolversTypes['StrukturJabatan']>>, ParentType, ContextType, Partial<QueryDaftarStrukturJabatanArgs>>;
  daftarStrukturOrganisasi?: Resolver<Maybe<Array<ResolversTypes['StrukturOrganisasi']>>, ParentType, ContextType, Partial<QueryDaftarStrukturOrganisasiArgs>>;
  daftarSubbagUnitKerja?: Resolver<Array<ResolversTypes['SubbagUnitKerja']>, ParentType, ContextType>;
  daftarSublevelJabatan?: Resolver<Array<ResolversTypes['SublevelJabatan']>, ParentType, ContextType>;
  daftarUnitGaji?: Resolver<Array<ResolversTypes['UnitGaji']>, ParentType, ContextType>;
  daftarUnitKerja?: Resolver<Array<ResolversTypes['UnitKerja']>, ParentType, ContextType>;
  fakultas?: Resolver<Maybe<ResolversTypes['Fakultas']>, ParentType, ContextType, RequireFields<QueryFakultasArgs, 'id'>>;
  gradeRemun?: Resolver<Maybe<ResolversTypes['GradeRemun']>, ParentType, ContextType, RequireFields<QueryGradeRemunArgs, 'id'>>;
  jabatan?: Resolver<Maybe<ResolversTypes['JabatanLevel']>, ParentType, ContextType, RequireFields<QueryJabatanArgs, 'id'>>;
  levelJabatan?: Resolver<Maybe<ResolversTypes['LevelJabatan']>, ParentType, ContextType, RequireFields<QueryLevelJabatanArgs, 'id'>>;
  pegawai?: Resolver<Maybe<ResolversTypes['Pegawai']>, ParentType, ContextType, RequireFields<QueryPegawaiArgs, 'id'>>;
  statusPegawai?: Resolver<Maybe<ResolversTypes['StatusPegawai']>, ParentType, ContextType, RequireFields<QueryStatusPegawaiArgs, 'id'>>;
  strukturJabatan?: Resolver<Maybe<ResolversTypes['StrukturJabatan']>, ParentType, ContextType, RequireFields<QueryStrukturJabatanArgs, 'id'>>;
  subbagUnitKerja?: Resolver<Maybe<ResolversTypes['SubbagUnitKerja']>, ParentType, ContextType, RequireFields<QuerySubbagUnitKerjaArgs, 'id'>>;
  sublevelJabatan?: Resolver<Maybe<ResolversTypes['SublevelJabatan']>, ParentType, ContextType, RequireFields<QuerySublevelJabatanArgs, 'id'>>;
  unitGaji?: Resolver<Maybe<ResolversTypes['UnitGaji']>, ParentType, ContextType, RequireFields<QueryUnitGajiArgs, 'id'>>;
  unitKerja?: Resolver<Maybe<ResolversTypes['UnitKerja']>, ParentType, ContextType, RequireFields<QueryUnitKerjaArgs, 'id'>>;
}>;

export type SsoRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SsoRole'] = ResolversParentTypes['SsoRole']> = ResolversObject<{
  code?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusAktifResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StatusAktif'] = ResolversParentTypes['StatusAktif']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ssoEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusPegawaiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StatusPegawai'] = ResolversParentTypes['StatusPegawai']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isSync?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StrukturJabatanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StrukturJabatan'] = ResolversParentTypes['StrukturJabatan']> = ResolversObject<{
  grade?: Resolver<Maybe<ResolversTypes['GradeRemun']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['LevelJabatan'], ParentType, ContextType>;
  sublevel?: Resolver<Maybe<ResolversTypes['SublevelJabatan']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StrukturLevelJabatanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StrukturLevelJabatan'] = ResolversParentTypes['StrukturLevelJabatan']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ssoRole?: Resolver<ResolversTypes['SsoRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StrukturOrganisasiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StrukturOrganisasi'] = ResolversParentTypes['StrukturOrganisasi']> = ResolversObject<{
  bagian?: Resolver<Maybe<ResolversTypes['BagianUnitKerja']>, ParentType, ContextType>;
  grade?: Resolver<Maybe<ResolversTypes['GradeRemun']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pegawai?: Resolver<Maybe<Array<ResolversTypes['Pegawai']>>, ParentType, ContextType>;
  posisi?: Resolver<ResolversTypes['Posisi'], ParentType, ContextType>;
  subbag?: Resolver<Maybe<ResolversTypes['SubbagUnitKerja']>, ParentType, ContextType>;
  unitKerja?: Resolver<Maybe<ResolversTypes['UnitKerja']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubbagUnitKerjaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubbagUnitKerja'] = ResolversParentTypes['SubbagUnitKerja']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SublevelJabatanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SublevelJabatan'] = ResolversParentTypes['SublevelJabatan']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitGajiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnitGaji'] = ResolversParentTypes['UnitGaji']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitKerjaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnitKerja'] = ResolversParentTypes['UnitKerja']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nama?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitKerjaPegawaiResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnitKerjaPegawai'] = ResolversParentTypes['UnitKerjaPegawai']> = ResolversObject<{
  bagian?: Resolver<Maybe<ResolversTypes['BagianUnitKerja']>, ParentType, ContextType>;
  grade?: Resolver<Maybe<ResolversTypes['GradeRemun']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSecondary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  posisi?: Resolver<ResolversTypes['Posisi'], ParentType, ContextType>;
  subbag?: Resolver<Maybe<ResolversTypes['SubbagUnitKerja']>, ParentType, ContextType>;
  unitKerja?: Resolver<Maybe<ResolversTypes['UnitKerja']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Alamat?: AlamatResolvers<ContextType>;
  BagianUnitKerja?: BagianUnitKerjaResolvers<ContextType>;
  DaftarPegawaiResponse?: DaftarPegawaiResponseResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Dosen?: DosenResolvers<ContextType>;
  Fakultas?: FakultasResolvers<ContextType>;
  FakultasJabatanDosen?: FakultasJabatanDosenResolvers<ContextType>;
  GradeRemun?: GradeRemunResolvers<ContextType>;
  Jabatan?: JabatanResolvers<ContextType>;
  JabatanKemenag?: JabatanKemenagResolvers<ContextType>;
  JabatanLevel?: JabatanLevelResolvers<ContextType>;
  Kontak?: KontakResolvers<ContextType>;
  LevelJabatan?: LevelJabatanResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationBagianUnitKerjaResponse?: MutationBagianUnitKerjaResponseResolvers<ContextType>;
  MutationFakultasResponse?: MutationFakultasResponseResolvers<ContextType>;
  MutationGradeRemunResponse?: MutationGradeRemunResponseResolvers<ContextType>;
  MutationLevelJabatanResponse?: MutationLevelJabatanResponseResolvers<ContextType>;
  MutationPegawaiResponse?: MutationPegawaiResponseResolvers<ContextType>;
  MutationPosisiResponse?: MutationPosisiResponseResolvers<ContextType>;
  MutationProdiResponse?: MutationProdiResponseResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  MutationStatusAktifResponse?: MutationStatusAktifResponseResolvers<ContextType>;
  MutationStrukturJabatanResponse?: MutationStrukturJabatanResponseResolvers<ContextType>;
  MutationStrukturOrganisasiResponse?: MutationStrukturOrganisasiResponseResolvers<ContextType>;
  MutationSubbagUnitKerjaResponse?: MutationSubbagUnitKerjaResponseResolvers<ContextType>;
  MutationSublevelJabatanResponse?: MutationSublevelJabatanResponseResolvers<ContextType>;
  MutationUnitGajiResponse?: MutationUnitGajiResponseResolvers<ContextType>;
  MutationUnitKerjaResponse?: MutationUnitKerjaResponseResolvers<ContextType>;
  Pangkat?: PangkatResolvers<ContextType>;
  Pegawai?: PegawaiResolvers<ContextType>;
  Pendidikan?: PendidikanResolvers<ContextType>;
  Posisi?: PosisiResolvers<ContextType>;
  Prodi?: ProdiResolvers<ContextType>;
  ProdiJabatanDosen?: ProdiJabatanDosenResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SsoRole?: SsoRoleResolvers<ContextType>;
  StatusAktif?: StatusAktifResolvers<ContextType>;
  StatusPegawai?: StatusPegawaiResolvers<ContextType>;
  StrukturJabatan?: StrukturJabatanResolvers<ContextType>;
  StrukturLevelJabatan?: StrukturLevelJabatanResolvers<ContextType>;
  StrukturOrganisasi?: StrukturOrganisasiResolvers<ContextType>;
  SubbagUnitKerja?: SubbagUnitKerjaResolvers<ContextType>;
  SublevelJabatan?: SublevelJabatanResolvers<ContextType>;
  UnitGaji?: UnitGajiResolvers<ContextType>;
  UnitKerja?: UnitKerjaResolvers<ContextType>;
  UnitKerjaPegawai?: UnitKerjaPegawaiResolvers<ContextType>;
}>;

