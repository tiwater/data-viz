package plugins

import (
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/grafana/grafana/pkg/util"
)

var _ fs.FS = (*LocalFS)(nil)

type LocalFS struct {
	m        map[string]*LocalFile
	basePath string
}

func NewLocalFS(m map[string]struct{}, basePath string) LocalFS {
	pfs := make(map[string]*LocalFile, len(m))
	for k := range m {
		pfs[k] = &LocalFile{
			path: k,
		}
	}

	return LocalFS{
		m:        pfs,
		basePath: basePath,
	}
}

func (f LocalFS) Open(name string) (fs.File, error) {
	cleanPath, err := util.CleanRelativePath(name)
	if err != nil {
		return nil, err
	}

	if kv, exists := f.m[filepath.Join(f.basePath, cleanPath)]; exists {
		if kv.f != nil {
			return kv.f, nil
		}
		return os.Open(kv.path)
	}
	return nil, ErrFileNotExist
}

func (f LocalFS) Base() string {
	return f.basePath
}

func (f LocalFS) Files() []string {
	var files []string
	for p := range f.m {
		r, err := filepath.Rel(f.basePath, p)
		if strings.Contains(r, "..") || err != nil {
			continue
		}
		files = append(files, r)
	}

	return files
}

var _ fs.File = (*LocalFile)(nil)

type LocalFile struct {
	f    *os.File
	path string
}

func (p *LocalFile) Stat() (fs.FileInfo, error) {
	return os.Stat(p.path)
}

func (p *LocalFile) Read(bytes []byte) (int, error) {
	var err error
	p.f, err = os.Open(p.path)
	if err != nil {
		return 0, err
	}
	return p.f.Read(bytes)
}

func (p *LocalFile) Close() error {
	if p.f != nil {
		return p.f.Close()
	}
	p.f = nil
	return nil
}
