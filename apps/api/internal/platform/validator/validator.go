package validator

import (
	"errors"
	"fmt"
	"strings"
	"sync"

	pv "github.com/go-playground/validator/v10"
)

var (
	once sync.Once
	v    *pv.Validate
)

func instance() *pv.Validate {
	once.Do(func() {
		v = pv.New(pv.WithRequiredStructEnabled())
	})
	return v
}

func Struct(s any) error {
	err := instance().Struct(s)
	if err == nil {
		return nil
	}
	var verrs pv.ValidationErrors
	if !errors.As(err, &verrs) {
		return err
	}
	parts := make([]string, 0, len(verrs))
	for _, fe := range verrs {
		parts = append(parts, fmt.Sprintf("%s: %s", fe.Field(), fe.Tag()))
	}
	return fmt.Errorf("%s", strings.Join(parts, "; "))
}
